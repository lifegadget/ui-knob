import Ember from 'ember';

const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line
import layout from '../templates/components/ui-knob';
import Stylist from 'ember-cli-stylist/mixins/shared-stylist';
import DDAU from '../mixins/ddau';

export default Ember.Component.extend(Stylist, DDAU, {
  layout,
  tagName: '',
  styleBindings: ['fontSize', 'fontWeight', 'fontFamily', 'width'],

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
  tabindex: 0,

  /**
   * By default leftRight is equal to "step" which is often appropriate
   * but users may override this to any explicit value they want
   */
  leftRight: computed('step', function() {
    return this.get('step') || 1;
  }),
  /**
   * By default the upDown incrementors will move by 10% of the total range of the max-min
   * range but users may override this to any explicit value they want
   */
  upDown: computed('min','max', function() {
    return (this.get('max') - this.get('min')) / 10;
  }),

  font: 'Arial',
  fontWeight: 'normal',
  fontSize: computed('width', function() {
    const {width} = this.getProperties('width');
    return `${width / 10}px`;
  }),

  actions: {
    onFocus(isFocused) {
      if(this.get('readOnly')) {
        this.set('isFocused', false);
        return false;
      }
      const code = isFocused ? 'gained-focus' : 'lost-focus';
      this.set('isFocused', isFocused);
      this.ddau('onFocus', {code, knob: this}, isFocused);
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
        }, min);
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
          value: max,
          oldValue: hash.oldValue,
          rejectedValue: hash.value
        }, max);
      }
      else {
        this.ddau('onChange', hash, hash.value);
      }
    }
  }

});
