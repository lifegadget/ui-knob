import Ember from 'ember';
import layout from '../templates/components/updown-knob';
import DDAU from '../mixins/ddau';
import Stylist from 'ember-cli-stylist/mixins/shared-stylist';

const { keys, create } = Object; // jshint ignore:line
const { RSVP: {Promise, all, race, resolve, defer} } = Ember; // jshint ignore:line
const { inject: {service} } = Ember; // jshint ignore:line
const { computed, observer, $, run, on, typeOf } = Ember;  // jshint ignore:line
const { get, set, debug } = Ember; // jshint ignore:line
const a = Ember.A; // jshint ignore:line

export default Ember.Component.extend(DDAU, Stylist, {
  layout,
  tagName: '',

  value: null,
  min: 0,
  max: 10,
  step: 1,

  upper: computed('value', function() {
    const {value} = this.getProperties('value');

    if(value) {
      if(typeOf(value) === 'object') {
        return value.upper;
      }
    } else {
      return undefined;
    }
  }),
  lower: computed('value', function() {
    const {value} = this.getProperties('value');

    if(value) {
      if(typeOf(value) === 'object') {
        return value.lower;
      }
    } else {
      return undefined;
    }
  }),

  _suggestValidValue(which, underlying) {
    const {value, min} = this.getProperties('value', 'min');
    if(typeOf(value) !== 'object' || value.upper === undefined || value.lower === undefined) {

      // send error
      const code = 'invalid-value';
      this.ddau('onError', {
        code,
        value: value,
        knob: which,
        message: `the updown-knob component expects an object with both "upper" and "lower" properties defined. Currently the value is of type ${typeOf(value)}, with value of: ${JSON.stringify(value)}`,
        underlyingError: underlying,
        context: this
      }, code);
      // suggest change
      const newValue = {
        lower: min,
        upper: min
      };
      this.ddau('onChange', {
        code: 'value-change-suggestion',
        value: newValue,
        oldValue: value,
        context: this
      }, newValue);

    } else {
      if (underlying) {
        this.ddau('onError', underlying, underlying.code);
      }
    }
  },

  actions: {
    onChange(which, hash) {
      const value = $.extend({}, this.get('value'));
      if(which === 'upper') {
        value.upper = hash.value;
      } else {
        value.lower = hash.value;
      }
      this.ddau('onChange', {
        code: `updown-${which}-knob-changed`,
        value: value,
        oldValue: this.get('value'),
        context: this
      }, value);
    },
    onError(which, hash) {
      if(hash.code === "invalid-value-on-tick-check") {
        this._suggestValidValue(which, hash);
      }
    },

  }

});
