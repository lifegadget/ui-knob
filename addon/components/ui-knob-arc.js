import Ember from 'ember';
import layout from '../templates/components/ui-knob-arc';
import { arc } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
// Converts from degrees to radians.
const toRadians = function(degrees) {
  return degrees * Math.PI / 180;
};
// Converts from radians to degrees.
const toDegrees = function(radians) {
  return radians * 180 / Math.PI;
};

const uiArc = Ember.Component.extend({
  layout,
  tagName: '',
  init() {
    this._super(...arguments);
    Ember.run.schedule('afterRender', () => {
      this.svg = document.getElementById(this.elementId);
      // this.draw();
    });
  },

  min: null,
  max: null,
  angleOffset: null,
  angleArc: null,
  _startAngle: Ember.computed('angleOffset', 'angleArc', function() {
    const angleOffset = Number(this.get('angleOffset'));
    const angleArc = Number(this.get('angleArc'));

    return angleOffset;
  }),
  _endAngle: Ember.computed('angleOffset', 'angleArc', function() {
    const angleOffset = Number(this.get('angleOffset'));
    const angleArc = Number(this.get('angleArc'));

    return angleOffset + angleArc > 360 ? angleOffset + angleArc - 360 : angleOffset + angleArc;
  }),

  value: null,
  _value: Ember.computed('value', 'min', 'max', 'angleArc', 'angleOffset', function() {
    const {min, max, angleOffset, angleArc, value} = this.getProperties('min', 'max', 'value', 'angleOffset', 'angleArc');
    const scalar = scaleLinear().domain([min, max]).range([0, (angleArc || 360) - (angleOffset || 0)]);

    return scalar(value);
  }),
  arc: Ember.computed('angleArc', 'angleOffset', function() {
    const {angleArc, angleOffset} = this.getProperties('angleArc', 'angleOffset');
    const endAngle = Number(angleArc) + Number(angleOffset);
    console.log(angleArc, angleOffset, endAngle);
    const knob = arc()
      .innerRadius( 110 )
      .outerRadius( 150 )
      .cornerRadius( 5 )
      .startAngle( toRadians(angleOffset) )
      .endAngle( toRadians( endAngle > 360 ? endAngle - 360 : endAngle ) );

      return knob();
  }),

  selectedArc: Ember.computed('_value','angleOffset', 'angleArc', function() {
    const {_value} = this.getProperties('_value');
    const selected = arc()
      .innerRadius( 110 )
      .outerRadius( 150 )
      .cornerRadius( 0 )
      .startAngle( toRadians(_value - 5) )
      .endAngle( toRadians(_value + 5) );

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
