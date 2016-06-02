import Ember from 'ember';
import layout from '../templates/components/time-knob';
import DDAU from '../mixins/ddau';
import Stylist from 'ember-cli-stylist/mixins/shared-stylist';
import moment from 'moment';

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
  _value: computed('value', function() {
    const {value, _valueType} = this.getProperties('value', '_valueType');
    return _valueType === 'string' ? moment().hours(value.split(':')[0]).minutes(value.split(':')[1]) : value;
  }),
  _valueType: computed('value', function() {
    const value = this.get('value');
    switch(typeOf(value)) {
      case 'string':
        return value.trim().match(/^\d{1,2}\:\d{2,2}$/) ? 'string' : 'unknown-string-format';
      case 'class':
        return value instanceof moment ? 'moment' : 'unknown-class';
      default:
        return 'unknown';
    }
  }),
  min: 0,
  max: 10,
  hoursStep: 1,
  minutesStep: 1,
  padding: 2,
  _minutesPadding: computed('padding', function() {
    return this.get('padding') * 2.2;
  }),
  format: 'h:mma',
  _hoursFormat: computed('format', function() {
    const format = this.get('format');
    const matches = format.match(/([hHk]+)/);

    return matches[1];
  }),
  _minutesFormat: computed('format', function() {
    const format = this.get('format');
    const matches = format.match(/\:([\sm]+)/);

    return matches[1];
  }),
  _ampmFormat: computed('format', function() {
    const format = this.get('format');
    const matches = format.match(/([\saA]+)/);

    return matches[1];
  }),

  hours: computed('value', function() {
    const {value} = this.getProperties('value');

    if(value) {
      if(typeOf(value) === 'class') {
        return value.format('H');
      }
    } else {
      return value.split(':')[0];
    }
  }),
  minutes: computed('value', function() {
    const {value} = this.getProperties('value');

    if(value) {
      if(typeOf(value) === 'class') {
        return value.format('mm');
      }
    } else {
      return value.split(':')[1];
    }
  }),

  _suggestValidValue(which, underlying) {
    const {value, min} = this.getProperties('value', 'min');
    if(typeOf(value) !== 'object' || value.hours === undefined || value.minutes === undefined) {

      // send error
      const code = 'invalid-value';
      this.ddau('onError', {
        code,
        value: value,
        knob: which,
        message: `the updown-knob component expects an object with both "hours" and "minutes" properties defined. Currently the value is of type ${typeOf(value)}, with value of: ${JSON.stringify(value)}`,
        underlyingError: underlying,
        context: this
      }, code);
      // suggest change
      const newValue = {
        hours: min,
        minutes: min
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
      const _value = this.get('_value').clone();
      const type = this.get('_valueType');
      if(which === 'hours') {
        _value.hours(hash.value);
      } else {
        _value.minutes(hash.value);
      }
      const newValue = type === 'string' ? _value.format('H:mm') : _value;
      this.ddau('onChange', {
        code: `time-${which}-changed`,
        value: newValue,
        oldValue: type === 'string' ? this.get('_value').format('H:mm') : this.get('_value').clone(),
        context: this
      }, newValue);
    },
    onError(which, hash) {
      if(hash.code === "invalid-value-on-tick-check") {
        this._suggestValidValue(which, hash);
      }
    },

  }

});
