import Ember from 'ember';
import layout from '../templates/components/ui-knob-arc';
import { drag } from 'd3-drag';
import { arc } from 'd3-shape';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { transition } from 'd3-transition';
import DDAU from '../mixins/ddau';

const { computed, observe, $, run, on, typeOf } = Ember;  // jshint ignore:line
const { get, set, debug } = Ember; // jshint ignore:line
const htmlSafe = Ember.String.htmlSafe;

// Converts from degrees to radians.
const toRadians = function(degrees) {
  return degrees * Math.PI / 180;
};

const uiArc = Ember.Component.extend(DDAU, {
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
  step: 1,
  angleOffset: 0,
  angleArc: 360,
  _startAngle: computed('min', 'max', 'angleOffset', 'angleArc', function() {
    const angleOffset = Number(this.get('angleOffset'));
    const angleArc = Number(this.get('angleArc'));
    return angleOffset + angleArc > 360 ? toRadians(360 - angleArc) :  toRadians(angleOffset);
  }),
  _endAngle: computed('min', 'max', 'angleOffset', 'angleArc', function() {
    const angleOffset = Number(this.get('angleOffset'));
    const angleArc = Number(this.get('angleArc'));

    return angleOffset + angleArc > 360 ? toRadians(angleOffset - (360 - angleArc)) : toRadians(angleOffset + angleArc);
  }),
  /**
   * Returns an array of ticks/states that the knob can be in
   * considering min, max, and step/precision
   */
  _ticks: computed('min','max','step', function() {
    const {min, max, step} = this.getProperties('min', 'max', 'step');
    const ticks = [];
    for(let i = Number(min); i <= Number(max); i += Number(step)) {
      ticks.push(i);
    }
    return ticks;
  }),
  /**
   * determines the offset of one tick in radians
   */
  _tickWidth: computed('_ticks', 'angleArc', function() {
    const {_ticks, angleArc} = this.getProperties('_ticks', 'angleArc');

    return toRadians(angleArc / _ticks.length);
  }),
  /**
   * given a value, determine where in the ticks index it resides
   */
  getTick(value) {
    const {_ticks, clockwise} = this.getProperties('_ticks', 'clockwise');
    let index = null;
    for(let i=0; i <= _ticks.length; i++) {
      if (_ticks[i] === Number(value)) {
        index = i;
        break;
      }
    }
    if(index !== null) {
      return clockwise ? index : _ticks.length - index - 1;
    } else {
      this.ddau('onError', {
        code: 'invalid-value-on-tick-check',
        value: value,
        ticks: _ticks,
        message: `Looking for the index value of ticks and found no records which match. This indicates the value is not valid. No suggestions are available.`
      }, false);

      return false;
    }
  },
  /**
   * maxPrecision is a user defined setting which states the max allowable
   * precison for the numbers output by knob. In contrast, _maxPrecision determines
   * the maximum precision that exists in the _ticks set (and caps it at the
   * user defined maxPrecision)
   */
  maxPrecision: 3,
  _maxPrecision: computed('_ticks', 'maxPrecision', function() {
    const {_ticks, maxPrecision} = this.getProperties('_ticks', 'maxPrecision');
    return _ticks.slice(0).reduce((previous, current) => {
      const decimalPlace = String(current).indexOf('.');
      if(decimalPlace !== -1) {
        const precision = String(current).substr(decimalPlace + 1).length;
        if (precision > previous || !previous) {
          return precision > maxPrecision ? maxPrecision : precision;
        }
      }

      return previous;
    });
  }),
  /**
   * Directionality of the knob's movement from min to max
   */
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
  _knobBackgroundStyle: computed('backgroundColor', function() {
    return this._strokeAndFill(this.get('backgroundColor'), {opacity: 1});
  }),
  _strokeAndFill(value, o = {}) {
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
      const opacity = o.opacity ? ` opacity: ${o.opacity}` : '';

      return htmlSafe(`stroke: ${props.stroke}; fill: ${props.fill};${opacity}`);
    } else {
      return '';
    }
  },

  /**
   * Responsible for mapping input domain to a degree-based range.
   * This also means including negative degrees when the range crosses
   * the 0 degree / "12 oclock" position.
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
   value: null,
  _value: computed('value','scalar', function() {
    const {scalar, value} = this.getProperties('scalar', 'value');
    return scalar(value);
  }),
  arc: computed('_startAngle', '_endAngle', 'thickness', function() {
    const {_startAngle, _endAngle, width, thickness} = this.getProperties('_startAngle', '_endAngle', 'width', 'thickness');
    const knob = arc()
      .innerRadius( (width / 2) - thickness )
      .outerRadius( width / 2 )
      .cornerRadius( 2 )
      .startAngle( _startAngle )
      .endAngle( _endAngle );

      return knob();
  }),

  inputHitZone: computed('width', function() {
    const {width} = this.getProperties('width');
    this.set('_hitZoneTransform', width / 25);
    const knob = arc()
      .innerRadius( 0 )
      .outerRadius( width / 6.5 )
      .startAngle( toRadians(0) )
      .endAngle( toRadians(360) );

      return knob();
  }),

  backgroundArc: computed('_startAngle', '_endAngle', function() {
    const {_startAngle, _endAngle, width, thickness} = this.getProperties('_startAngle', '_endAngle', 'width', 'thickness');
    const knob = arc()
      .innerRadius( 0 )
      .outerRadius( width / 2 )
      .startAngle( toRadians(0) )
      .endAngle( toRadians(360) );

      return knob();
  }),


  selectedArc: computed('value', '_startAngle', '_tickWidth', 'thickness', 'clockwise', function() {
    const {width, value, _startAngle, _tickWidth, thickness} = this.getProperties('width', 'value', '_startAngle', '_tickWidth', 'thickness');
    const tickIndex = this.getTick(value);
    const selected = arc()
      .innerRadius( (width / 2) - thickness )
      .outerRadius( width / 2 )
      .cornerRadius( 2 )
      .startAngle( _startAngle + tickIndex * _tickWidth )
      .endAngle( _startAngle + (tickIndex + 1) * _tickWidth );

    return selected();
  }),

  selectedPaddingArc: computed('value', '_startAngle', '_tickWidth', 'selectedPadding','thickness', function() {
    const {width, value, _startAngle, _endAngle, _tickWidth, thickness, selectedPadding} = this.getProperties('width', 'value', '_startAngle', '_endAngle', '_tickWidth', 'thickness', 'selectedPadding');
    const tickIndex = this.getTick(value);
    let padding;
    let start;
    let end;
    if (!selectedPadding) {
      return false;
    }
    else if (selectedPadding.substr(-3) === 'deg') {
      padding = toRadians(selectedPadding.substr(0, selectedPadding.length - 3));
      console.log('padding for degrees', padding);
      start = _startAngle + (tickIndex * _tickWidth) - padding;
      end = _startAngle + ((tickIndex + 1) * _tickWidth) + padding;
    }
    else if (selectedPadding === 'upTo') {
      console.log('upTo:', start, end);
      start = _startAngle;
      end = _startAngle + (tickIndex * _tickWidth);
    }
    else if(!Number.isNaN(selectedPadding)) {
      padding = Number(selectedPadding) * _tickWidth;
      start = _startAngle + (tickIndex * _tickWidth) - padding;
      end = _startAngle + ((tickIndex + 1) * _tickWidth) + padding;
    } else {
      this.ddau('onError', {
        code: 'unknown-selected-padding-value',
        value: selectedPadding
      });
      return false;
    }

    start = start < _startAngle ? _startAngle : start;
    end = end > _endAngle ? _endAngle : end;

    const selected = arc()
      .innerRadius( (width / 2) - thickness )
      .outerRadius( width / 2 )
      .cornerRadius( 2 )
      .startAngle( start )
      .endAngle( end );

    return selected();
  }),

  transformWidth: Ember.computed('width','horizontalAdjustment', function() {
    const {width,  horizontalAdjustment} = this.getProperties('width', 'horizontalAdjustment');
    return (width / 2) + horizontalAdjustment;
  }),
  transformHeight: Ember.computed('width','verticalAdjustment', function() {
    const {width,  verticalAdjustment} = this.getProperties('width', 'verticalAdjustment');
    return (width / 2) + verticalAdjustment;
  }),


});


uiArc.reopenClass({
  positionalParams: ['value']
});
uiArc[Ember.NAME_KEY] = 'ui-knob-arc';
export default uiArc;
