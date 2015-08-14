import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line
import layout from '../templates/components/ui-knob';
import Stylist from 'ui-knob/mixins/stylist';
const apiSurface = ['min','max','step','angleOffset','angleArc','stopper','readOnly','rotation','cursor','thickness','lineCap','width','height','dataWidth', 'displayInput','displayPrevious','fgColor','bgColor','inputColor','font','fontWeight','skin'];

export default Ember.Component.extend(Stylist,{
  layout: layout,
  tagName: 'input',
  type: 'text',
  classNames: ['ui-knob', 'dial'],
  attributeBindings: ['type','value','style'],
  value: 0,
  style: computed('width','uomHeight',function() {
    var width = this.get('width');
    var top = this.get('uomHeight');
    return 'display: block; position: relative; width: ' + width + 'px; ' + 'bottom: ' + top + 'px; ';
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
  displayInput: true,
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

    return o;
  },
  buildOptions() {
    var self = this;
    let o = this.getOptions();
    // ADD EVENTS
    o.change = function(value) {
      Ember.run.schedule('afterRender', function() {
        self.set('interimValue', value);
      });
    };
    o.release = function(value) {
      Ember.run.schedule('afterRender', function() {
        self.set('value', value);
        self.sendAction('released');
      });
    };
    o.cancel = function() {
      Ember.run.schedule('afterRender', function() {
        this.sendAction('cancelled');
      });
    };

    return o;
  },

  // INITIALISE / ON LOAD
  // --------------------
  _init: on('didInsertElement', function() {
    var isVisible = this.$().get(0).offsetWidth > 0;
    if (isVisible) {
      this.visibilityDidHappen();
    }
  }),
  visibilityEventEmitter: function(context) {
    // since there is no specific DOM event for a change in visibility we must rely on
    // whatever component is creating this change to notify us via a bespoke event
    // this function is setup for a Bootstrap tab pane; for other event emmitters you will have to build your own
    try {
      var thisTabPane = context.$().closest('.tab-pane').attr('id');
      var $emitter = context.$().closest('.tab-content').siblings('[role=tabpanel]').find('li a[aria-controls=' + thisTabPane + ']');
      return $emitter;
    } catch(e) {
      console.log('Problem getting event emitter: %o', e);
    }

    return false;
  },
  visibilityEventName: 'shown.bs.tab',
  isInitialised: false,

  // ASYNC EVENTS
  // -------------------
  initiateKnob: on('didRender',function() {
    this.set('isInitialised', true);
    var options = this.buildOptions();
    this.$().knob(options);
    this.syncValue();
    this.benchmarkConfig();
    this.resizeDidHappen(); // get dimensions initialised on load
    this.resizeListener(); // add a listener for future resize events
  }),
  resizeListener: function() {
    var localisedResize = `resize.${this.get('elementId')}`;
    this.$(window).on(localisedResize, Ember.run.bind(this, this.trigger, ['resizeDidHappen']));
  },
  visibilityListener: on('didInsertElement', function() {
    // Listen for visibility event and signal a resize when it happens
    // note: this listener is placed on a DOM element which is assumed
    //       to always be visibile so no need to wait on placing this listener
    var self = this;
    Ember.run.schedule('afterRender', function() {
      var $selector = self.get('visibilityEventEmitter')(self);
      $selector.on(self.get('visibilityEventName'), Ember.run.bind(self, self.visibilityDidHappen ));
    });
  }),
  unbindListeners: on('willDestroyElement', function() {
    var localisedResize = `resize.${this.get('elementId')}`;
      this.$(window).off(localisedResize);
    }),
  visibilityDidHappen: function() {
    // On the first visibility event, the component must be initialised
    if(!this.get('isInitialised')) {
      this.initiateKnob();
    } else {
      // force a resize assessment as window sizing may have changed
      // since last time component was visible
      this.resizeDidHappen();
    }
  },
  configDidChange() {
    const _config = this._config;
    const changedConfig = apiSurface.filter(item => {
      return this[item] !== _config[item];
    });
    const newConfig = this.getProperties(...changedConfig);
    Ember.run.schedule('afterRender', () => {
      this.$().trigger('configure', newConfig);
      this.benchmarkConfig();
    });
  },
  benchmarkConfig() {
    this.set('_config', this.getOptions());
  },
  resizeDidHappen() {
    var self = this;
    Ember.run.schedule('afterRender', function() {
      var isVisible = self.$().get(0).offsetWidth > 0;
      if (isVisible) {
        // get dimensions
        var newWidth = Number(self.$().parent().get(0).offsetWidth);
        var newHeight = Number(self.$().parent().get(0).offsetHeight);
        var uomVerticalPosition = Math.floor(newHeight / 3);
        // set instance variables
        self.set('width', newWidth);
        self.set('height', newWidth);
        self.set('uomVerticalPosition', uomVerticalPosition); // set pixels above the bottom of the knob
        // adjust knob width/height
        self.$('.knob').trigger(
          'configure',
          {
            width: newWidth,
            height: newWidth
          }
        );
        self.benchmarkConfig();
      }
    });
  },
  valueDidChange: observer('value', function() {
    Ember.run.debounce(this, this.syncValue, 300, false);
  }),
  syncValue: function() {
    this.$('.knob').val(Number(this.get('value'))).trigger('change');
  }

});
