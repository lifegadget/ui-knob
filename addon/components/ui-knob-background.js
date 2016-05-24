import Ember from 'ember';
import layout from '../templates/components/ui-knob-background';
const { keys, create } = Object; // jshint ignore:line
const { RSVP: {Promise, all, race, resolve, defer} } = Ember; // jshint ignore:line
const { inject: {service} } = Ember; // jshint ignore:line
const { computed, observe, $, run, on, typeOf } = Ember;  // jshint ignore:line
const { get, set, debug } = Ember; // jshint ignore:line
const a = Ember.A; // jshint ignore:line

export default Ember.Component.extend({
  layout,
  tagName:'',

  width: null,
  height: null,
  color: '#fff',
  cx: computed('width', function() {
    return this.get('width') / 2;
  }),
  cy: computed('height', function() {
    return this.get('height') / 2;
  })

});
