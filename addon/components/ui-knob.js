import Ember from 'ember';
import layout from '../templates/components/ui-knob';
import Stylist from 'ember-cli-stylist/mixins/shared-stylist';
import DDAU from '../mixins/ddau';

const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line
const apiSurface = ['min','max','step','angleOffset','angleArc','stopper','readOnly','rotation','cursor','thickness','lineCap','width','height','dataWidth', 'displayInput','displayPrevious','fgColor','bgColor','inputColor','font','fontWeight','skin'];

export default Ember.Component.extend(DDAU, Stylist,{
  layout,
  tagName: '',
  type: 'text',
  value: 0,
  _value: computed('value', {
    set(_, value) {
      return value;
    },
    get() {
      return this.get('value');
    }
  }),

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
  displayInput: false, // the ui-knob's input should ALWAYS be hidden
  displayPrevious: true,
  fgColor: '#66CC66',
  bgColor: '#EFEEEE',
  inputColor: 'black',
  font: 'Arial',
  fontWeight: 'normal',
  _configListener: observer(...apiSurface, function() {
    this.configDidChange();
  }),
  getOptions() {
    var o = this.getProperties(apiSurface);
    ['min','max','step'].map(item => {
      if(o[item]) {
        o[item] = Number(o[item]);
      }
    });
    o.displayInput = false;

    return o;
  },
  rememberOptions(o) {
    this._config = o;
  },


  // INITIALISE / ON LOAD
  // --------------------
  didInsertElement() {
    this._super(...arguments);
    this.initiateKnob();
  },

  // ASYNC EVENTS
  // -------------------
  initiateKnob() {
    var options = this.getOptions();
    this.addEventCallbacks(options);
    this.rememberOptions(options);
    $(`#input-${this.elementId}`).knob(options);
    this.syncValue();
    this.resizeDidHappen(); // get dimensions initialised on load
    this.resizeListener(); // add a listener for future resize events
  },
  addEventCallbacks(o) {
    // EVENT CALLBACKS
    o.change = function(value) {
      this.set('_value', value);
      const roundedValue = Math.round(value);
      this.ddau('onDrag', {
        code: 'value-changing',
        value: roundedValue,
        oldValue: this.get('value')
      }, roundedValue);
    }.bind(this);
    o.release = function(value) {
      this.set('_value', value);
      this.ddau('onChange', {
        code: 'value-changed',
        value: value,
        oldValue: this.get('value')
      }, value);
    }.bind(this);
    o.cancel = function() {
      this.sendAction('cancelled');
    }.bind(this);
  },
  resizeListener: function() {
    var localisedResize = `resize.${this.get('elementId')}`;
    $(window).on(localisedResize, Ember.run.bind(this, this.trigger, ['resizeDidHappen']));
  },

  unbindListeners: on('willDestroyElement', function() {
    var localisedResize = `resize.${this.get('elementId')}`;
      $(window).off(localisedResize);
    }),
  configDidChange() {
    const _config = this._config;
    const changedConfig = apiSurface.filter(item => {
      return this[item] !== _config[item];
    });
    const newConfig = this.getProperties(...changedConfig);
    Ember.run.schedule('afterRender', () => {
      $(`#input-${this.elementId}`).trigger('configure', newConfig);
    });
  },
  resizeDidHappen() {
    var self = this;
    Ember.run.schedule('afterRender', function() {
      var isVisible = $(`#input-${self.elementId}`).get(0).offsetWidth > 0;
      if (isVisible) {
        // get dimensions
        var newWidth = Number($(`#input-${self.elementId}`).get(0).offsetWidth);
        var newHeight = Number($(`#input-${self.elementId}`).offsetHeight);
        var uomVerticalPosition = Math.floor(newHeight / 3);
        // set instance variables
        self.set('width', newWidth);
        self.set('height', newWidth);
        self.set('uomVerticalPosition', uomVerticalPosition); // set pixels above the bottom of the knob
        // adjust knob width/height
        $(`#input-${self.elementId}`).trigger(
          'configure',
          {
            width: newWidth,
            height: newWidth
          }
        );
        // self.benchmarkConfig();
      }
    });
  },
  valueDidChange: observer('value', function() {
    Ember.run.debounce(this, this.syncValue, 30, false);
  }),
  syncValue: function() {
    $(`#input-${this.elementId}`).val(Number(this.get('value'))).trigger('change');
  },

  actions: {
    onChange(hash) {
      this.ddau('onChange', hash, hash.value);
    }
  }

});
