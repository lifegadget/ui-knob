import Ember from 'ember';
import layout from '../templates/components/ui-knob-numeric-input';
const { keys, create } = Object; // jshint ignore:line
const { RSVP: {Promise, all, race, resolve, defer} } = Ember; // jshint ignore:line
const { inject: {service} } = Ember; // jshint ignore:line
const { computed, observe, $, run, on, typeOf } = Ember;  // jshint ignore:line
const { get, set, debug } = Ember; // jshint ignore:line
const a = Ember.A; // jshint ignore:line

const numericInput = Ember.Component.extend({
  layout,
  tagName:'',
  
  pre: null,
  post: null,
  upper: null,
  lower: null,

  width: null, // this is the overall width
  _width: computed('width', 'offset', function() {
    return this.get('width') - this.get('offset') * 2;
  }),
  height: null,
  thickness: null, // in percentage terms
  _thickness: computed('width', 'thickness', function() {
    // in pixel terms
    const {width, thickness} = this.getProperties('width', 'thickness');
    return width * thickness;
  }),

  offset: computed('width', 'height', 'thickness', function() {
    const {_thickness} = this.getProperties('_thickness');
    return _thickness;
  }),
});
numericInput.reopenClass({
  positionalParams: ['value']
});
numericInput[Ember.NAME_KEY] = 'numeric-input';
export default numericInput;
