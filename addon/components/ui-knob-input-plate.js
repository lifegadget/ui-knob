import Ember from 'ember';
import layout from '../templates/components/ui-knob-input-plate';
const { keys, create } = Object; // jshint ignore:line
const { RSVP: {Promise, all, race, resolve, defer} } = Ember; // jshint ignore:line
const { inject: {service} } = Ember; // jshint ignore:line
const { computed, observe, $, run, on, typeOf } = Ember;  // jshint ignore:line
const { get, set, debug } = Ember; // jshint ignore:line
const a = Ember.A; // jshint ignore:line

const plate = Ember.Component.extend({
  layout,
  tagName: '',

  width: null,
  height: null,
  thickness: null,
  color: '#fff',
  dimensions: computed('radius', function() {
    return this.get('radius') * 2;
  }),
  radius: computed('width', 'height', 'thickness', function() {
    const {width, height, thickness} = this.getProperties('width', 'height','thickness');
    const dimension = Math.max(width, height);
    return (dimension - (dimension * thickness)) / 2;
  }),
  offset: computed('width', 'height', 'thickness', function() {
    const {width, height, thickness} = this.getProperties('width', 'height','thickness');
    const dimension = Math.max(width, height);
    return (dimension * thickness) / 2;
  }),


  actions: {
    clickKill(e) {
      console.log('kill prop');
      // e.preventDefault();
      // e.stopPropagation();
    }
  }

});
plate.reopenClass({
  positionalParams: ['color']
});
plate[Ember.NAME_KEY] = 'ui-knob-input-plate';
export default plate;
