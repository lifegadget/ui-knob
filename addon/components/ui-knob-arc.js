import Ember from 'ember';
import layout from '../templates/components/ui-knob-arc';
import { arc } from 'd3-shape';
import { scaleLinear } from 'd3-scale';

const { computed, observe, $, run, on, typeOf } = Ember;  // jshint ignore:line
const { get, set, debug } = Ember; // jshint ignore:line


// Converts from degrees to radians.
const toRadians = function(degrees) {
  return degrees * Math.PI / 180;
};
// Converts from radians to degrees.
const toDegrees = function(radians) {
  return radians * 180 / Math.PI;
};

const XOR = function(a,b) {
  return ( a ? 1 : 0 ) ^ ( b ? 1 : 0 );
};

const uiArc = Ember.Component.extend({
  layout,
  tagName: '',
  init() {
    this._super(...arguments);
    Ember.run.schedule('afterRender', () => {
      this.svg = document.getElementById(this.elementId);
    });
  },

  min: null,
  max: null,
  angleOffset: null,
  angleArc: null,
  _startAngle: Ember.computed('angleOffset', function() {
    const angleOffset = Number(this.get('angleOffset'));

    return angleOffset;
  }),
  _endAngle: computed('angleOffset', 'angleArc', function() {
    const angleOffset = Number(this.get('angleOffset'));
    const angleArc = Number(this.get('angleArc'));
    console.log('endAngle calc: ', angleOffset, angleArc, angleOffset + angleArc > 360 ? angleOffset - (360 - angleArc) : angleOffset + angleArc);

    return angleOffset + angleArc > 360 ? angleOffset - (360 - angleArc) : angleOffset + angleArc;
  }),
  /**
   * flip
   *
   * in cases where angleOffset + angleArc > 360 we must flip the circle (vert & horz)
   * to allow for the crossing of the "0 degree / 12 o'clock" mark.
   */
  _flip: computed('angleOffset', 'angleArc', function() {
    return Number(this.get('angleOffset')) + Number(this.get('angleArc')) > 360;
  }),
  clockwise: true,

  value: null,
  /**
   * Responsible for mapping input domain to a degree-based range. Also accounts for the
   * "flipped" state In the flipped state where the directionality needs to be reversed
   */
  _value: computed('value', 'min', 'max', 'angleArc', 'angleOffset', function() {
    const {min, max, angleOffset, angleArc, value, _flip, clockwise} = this.getProperties('min', 'max', 'value', 'angleOffset', 'angleArc', '_flip', 'clockwise');
    const direction = XOR(clockwise, _flip);
    const directionalDomain = direction ? [min, max] : [max, min];
    console.log('direction: ', direction, directionalDomain);
    const scalar = scaleLinear().domain(directionalDomain).range([0, angleArc || 360 - (angleOffset || 0)]);

    return scalar(value);
  }),
  arc: computed('_startAngle', '_endAngle', function() {
    const {_startAngle, _endAngle} = this.getProperties('_startAngle', '_endAngle');
    const knob = arc()
      .innerRadius( 110 )
      .outerRadius( 150 )
      .cornerRadius( 5 )
      .startAngle( toRadians(_startAngle) )
      .endAngle( toRadians(_endAngle) );

      return knob();
  }),


  selectedArc: computed('_value','angleOffset', 'angleArc', function() {
    const {_value, _startAngle} = this.getProperties('_value', '_startAngle');
    const selected = arc()
      .innerRadius( 110 )
      .outerRadius( 150 )
      .cornerRadius( 0 )
      .startAngle( toRadians(_startAngle + _value - 5) )
      .endAngle( toRadians(_startAngle + _value + 5) );

    console.log(`selectedArc:: val: ${_value}, `, selected());

    return selected();
  }),

  transformSize: Ember.computed('width', function() {
    return this.get('width') / 2;
  })
});


uiArc.reopenClass({
  positionalParams: ['value']
});
uiArc[Ember.NAME_KEY] = 'ui-knob-arc';
export default uiArc;
