import Ember from 'ember';
import layout from '../templates/components/ui-knob-value';
const { get, set, debug } = Ember; // jshint ignore:line
const a = Ember.A; // jshint ignore:line

const viewValue = Ember.Component.extend({
  layout,
  tagName:'',

  value: null,
  blurValue: null,
  step: null,

  pre: null,
  post: null,
  upper: null,
  lower: null,
  _blurValue: computed('blurValue', 'step', function() {
    const {step, blurValue} = this.getProperties('step', 'blurValue');
    const precision = step - Math.floor(step) === 0 ? 0 : String(step).split('.')[1].length - 1;
    return Math.round(blurValue * Math.exp(precision)) / Math.exp(precision);
  }),

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
viewValue.reopenClass({
  positionalParams: ['value']
});
viewValue[Ember.NAME_KEY] = 'ui-knob-input';
export default viewValue;
