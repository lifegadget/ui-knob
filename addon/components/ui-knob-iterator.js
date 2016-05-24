import Ember from 'ember';
import layout from '../templates/components/ui-knob-iterator';

const iterator = Ember.Component.extend({
  layout,
  tagName: '',

  amount: null, // amount to iterate (note: iterators work on "blur" action)
  min: null,
  max: null,



});
iterator.reopenClass({
  positionalParams: ['amount']
});
iterator[Ember.NAME_KEY] = 'iterator';
export default iterator;
