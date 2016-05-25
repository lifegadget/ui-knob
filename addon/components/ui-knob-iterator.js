import Ember from 'ember';
import layout from '../templates/components/ui-knob-iterator';
import DDAU from '../mixins/ddau';

const iterator = Ember.Component.extend(DDAU,{
  layout,
  tagName: '',

  amount: null, // amount to iterate (note: iterators work on "blur" action)
  min: null,
  max: null,
  value: null,

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
