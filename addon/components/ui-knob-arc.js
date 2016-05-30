import Ember from 'ember';
import layout from '../templates/components/ui-knob-arc';
import { drag } from 'd3-drag';
import { arc } from 'd3-shape';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { transition } from 'd3-transition';

const { computed, observe, $, run, on, typeOf } = Ember;  // jshint ignore:line
const { get, set, debug } = Ember; // jshint ignore:line
const htmlSafe = Ember.String.htmlSafe;

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
      this.addDragListeners(`#${this.elementId} .unselected`);
      this.addTransition(`#${this.elementId} .selected`);
    });
  },

  addDragListeners(target) {
    drag.container = this;
    select(target).call(drag().on('start', this._dragStart));
    select(target).call(drag().on('drag', this._dragging));
    select(target).call(drag().on('end', this._dragEnd));
  },

  _dragStart(e) {
    console.log('drag starting', e);
  },
  _dragging(e) {
    console.log('dragging', e);
  },
  _dragEnd(e) {
    console.log('drag ending', e);
  },

  addTransition(target) {
    transition().select(target);
  },

  min: 0,
  max: 10,
  angleOffset: 0,
  angleArc: 360,
  _startAngle: Ember.computed('min', 'max', 'angleOffset', 'angleArc', function() {
    const angleOffset = Number(this.get('angleOffset'));
    const angleArc = Number(this.get('angleArc'));
    return angleOffset + angleArc > 360 ? toRadians(360 - angleArc) :  toRadians(angleOffset);
  }),
  _endAngle: computed('min', 'max', 'angleOffset', 'angleArc', function() {
    const angleOffset = Number(this.get('angleOffset'));
    const angleArc = Number(this.get('angleArc'));

    return angleOffset + angleArc > 360 ? toRadians(angleOffset - (360 - angleArc)) : toRadians(angleOffset + angleArc);
  }),
  clockwise: true,
  /**
   * Evaluates thickness as either a fixed number or percentage value
   */
   thickness: 40,
  _thickness: computed('thickness', 'width', function() {
    const {thickness, width} = this.getProperties('thickness', 'width');
    return thickness < 1 ? thickness * width : thickness;
  }),
  // for all colors, null defers to CSS values
  selectedColor: null,
  unselectedColor: null,
  backgroundColor: null,
  _knobSelectedStyle: computed('selectedColor', function() {
    return this._strokeAndFill(this.get('selectedColor'));
  }),
  _knobUnselectedStyle: computed('unselectedColor', function() {
    return this._strokeAndFill(this.get('unselectedColor'));
  }),
  _strokeAndFill(value) {
    let props;
    if (value) {
      switch(typeOf(value)) {
        case 'string':
          props = {
            stroke: value.split(',')[0],
            fill: value.split(',')[value.split(',').length - 1]
          };
          break;
        case 'function':
          props = value(this.get('value'));
          break;
        case 'object':
          props = value;
          break;
        default:
          debug('ui-knob-arc: unknown property value for determining stroke and fill:', value);
          props = {stroke: 'inherit', fill: 'inherit'};
      }

      return htmlSafe(`stroke: ${props.stroke}; fill: ${props.fill};`);
    } else {
      return '';
    }
  },

  value: null,
  /**
   * Responsible for mapping input domain to a degree-based range. This also means including negative degrees
   * when the range crosses the 0 degree / "12 oclock" position.
   */
  scalar: computed('value', 'min', 'max', '_startAngle', '_endAngle', 'clockwise', function() {
    const {min, max, clockwise, _startAngle, _endAngle} = this.getProperties('min', 'max', 'clockwise', '_startAngle', '_endAngle');
    const directionalDomain = clockwise ? [min, max] : [max, min];
    const scalar = scaleLinear().domain(directionalDomain).range([_startAngle, _endAngle]);

    return scalar;
  }),
  /**
   * Takes inputted value and maps to appropriate radian domain value using scalar
   */
  _value: computed('value','scalar', function() {
    const {scalar, value} = this.getProperties('scalar', 'value');
    return scalar(value);
  }),
  arc: computed('_startAngle', '_endAngle', function() {
    const {_startAngle, _endAngle, width, thickness} = this.getProperties('_startAngle', '_endAngle', 'width', 'thickness');
    const knob = arc()
      .innerRadius( (width / 2) - thickness )
      .outerRadius( width / 2 )
      .cornerRadius( 2 )
      .startAngle( _startAngle )
      .endAngle( _endAngle );

      return knob();
  }),


  selectedArc: computed('value', '_startAngle', '_endAngle', function() {
    const {value, _startAngle, scalar, width, thickness} = this.getProperties('value', '_startAngle', 'scalar', 'width', 'thickness');

    const selected = arc()
      .innerRadius( (width / 2) - thickness )
      .outerRadius( width / 2 )
      .cornerRadius( 2 )
      .startAngle( _startAngle + scalar(value - 1.25) )
      .endAngle( _startAngle + scalar(value - 0.25) );

    return selected();
  }),

  startedDrag(e) {
    console.log('started drag', e);
  },

  transformSize: Ember.computed('width', function() {
    return this.get('width') / 2;
  }),

  actions: {
    startSelectionDrag(e) {
      console.log('starting drag', e);
    }
  }
});


uiArc.reopenClass({
  positionalParams: ['value']
});
uiArc[Ember.NAME_KEY] = 'ui-knob-arc';
export default uiArc;
