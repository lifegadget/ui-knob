import Ember from 'ember';
import layout from '../templates/components/ui-knob-iterator';
import DDAU from '../mixins/ddau';

const { keys, create } = Object; // jshint ignore:line
const { RSVP: {Promise, all, race, resolve, defer} } = Ember; // jshint ignore:line
const { inject: {service} } = Ember; // jshint ignore:line
const { computed, observe, $, run, on, typeOf } = Ember;  // jshint ignore:line
const { get, set, debug } = Ember; // jshint ignore:line
const a = Ember.A; // jshint ignore:line

const iterator = Ember.Component.extend(DDAU,{
  layout,
  tagName: '',

  amount: null, // amount to iterate (note: iterators work on "blur" action)
  min: null,
  max: null,
  step: null,
  value: null,
  blurValue: null,

  actions: {
    onIterate() {
      const {value, min, max, amount} = this.getProperties('value', 'min', 'max', 'amount');
      let newValue = Number(value) + Number(amount);
      let error;
      if(newValue < min) {
        error = 'min-value-breached';
        newValue = min;
      }
      if(newValue > max) {
        error = 'max-value-breached';
        newValue = max;
      }
      if(Number.isNaN(value)) {
        error = 'invalid-value';
      }
      if(error) {
        this.ddau('onError', {
          code: 'min-value-breached',
          amount: Number(amount),
          oldValue: Number(value),
          suggestedValue: Number(newValue),
          attemptedValue: value + amount
        }, newValue);
      }

      this.ddau('onIterate', {
        code: `iterate-value-${this.get('direction')}`,
        amount: Number(amount),
        value: Number(newValue)
      }, Number(newValue));
    }
  }

});
iterator.reopenClass({
  positionalParams: ['amount']
});
iterator[Ember.NAME_KEY] = 'iterator';
export default iterator;
