import Ember from 'ember';
import { arc, pie } from 'd3-shape';

const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line
import layout from '../templates/components/ui-knob';
import Stylist from 'ember-cli-stylist/mixins/shared-stylist';
import DDAU from '../mixins/ddau';

const apiSurface = ['min','max','step','angleOffset','angleArc','stopper','readOnly','rotation','cursor','thickness','lineCap','width','height','dataWidth', 'displayInput','displayPrevious','fgColor','bgColor','inputColor','font','fontWeight','skin'];

export default Ember.Component.extend(Stylist, DDAU, {
  layout,
  tagName: '',
  styleBindings: ['outline', 'fontSize', 'fontWeight', 'fontFamily'],

  type: 'text',
  value: 0,

  // Behaviour props
  min: 0,
  max: 10,
  angleOffset: 10,
  angleArc: 340,
  stopper: true,
  step: 1,
  readOnly: false,
  rotation: 'clockwise',
  // UI related props
  cursor: false, // set to a number to have a partial line show instead of a "total line"
  thickness: 0.3,
  lineCap: 'butt', // can also be "round"
  width: 100,
  hasDirectInput: false, // show a text input box
  uom: null,
  skin: 'tron',
  uomColor: 'grey',
  uomVerticalPosition: 0,
  uomStyle: computed('uomColor','width','uomVerticalPosition', function() {
    var prop = this.getProperties('uomColor','width','uomVerticalPosition');
    return 'color: ' + prop.uomColor + ';' + ' width: ' + prop.width + 'px; ' +'bottom: ' + prop.uomVerticalPosition + 'px; ';
  }),
  hasUom: Ember.computed.bool('uom'),
  height: 100,
  displayInput: true,
  displayPrevious: true,
  selectedColor: '#66CC66',
  unselectedColor: '#EFEEEE',
  inputColor: 'black',

  leftRight: 1,
  upDown: 10,

  font: 'Arial',
  fontWeight: 'normal',
  outline: 'none',

  actions: {
    onFocus(isFocused) {
      this.set('isFocused', isFocused);
    },
    onChange(hash) {
      const {min, max} = this.getProperties('min', 'max');
      if(hash.value < min) {
        const code = 'min-value-breached';
        this.ddau('onError', {
          code: code,
          attemptedValue: hash.value,
          suggestedValue: min,
          message: `Attempt by "${hash.code}" to set value lower than allowed minimum. Minimum value proposed instead.`
        }, code);
        this.ddau('onChange', {
          code: 'keep-to-minimum-value',
          value: min,
          oldValue: hash.oldValue,
          rejectedValue: hash.value
        });
      }
      else if(hash.value > max) {
        const code = 'max-value-breached';
        this.ddau('onError', {
          code: code,
          attemptedValue: hash.value,
          suggestedValue: max,
          message: `Attempt by "${hash.code}" to set value higher than allowed maximum. Minimum value proposed instead.`
        }, code);
        this.ddau('onChange', {
          code: 'keep-to-maximum-value',
          value: min,
          oldValue: hash.oldValue,
          rejectedValue: hash.value
        });
      }
      else {
        this.ddau('onChange', hash, hash.value);
      }
    }
  }

});
