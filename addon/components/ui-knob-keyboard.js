import Ember from 'ember';
import layout from '../templates/components/ui-knob-keyboard';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import { EKMixin, keyDown } from 'ember-keyboard';
import DDAU from '../mixins/ddau';

const { computed, observe, $, run, on, typeOf } = Ember;  // jshint ignore:line
const { get, set, debug } = Ember; // jshint ignore:line
const a = Ember.A; // jshint ignore:line

export default Ember.Component.extend(EKMixin, DDAU, RecognizerMixin, {
  layout,
  tagName: 'event-listeners',
  recognizers: 'swipe vertical-swipe',

  init() {
    this._super(...arguments);
    this.set('keyboardActivated', true);
  },

  leftArrow: Ember.on(keyDown('ArrowLeft'), function(e) {
    this._leftRight(e, 'keyboard-increment-left');
  }),

  rightArrow: Ember.on(keyDown('ArrowRight'), function(e) {
    this._leftRight(e, 'keyboard-increment-right');
  }),

  upArrow: Ember.on(keyDown('ArrowUp'), function(e) {
    this._upDown(e, 'keyboard-increment-up');
  }),

  downArrow: Ember.on(keyDown('ArrowDown'), function(e) {
    this._upDown(e, 'keyboard-increment-down');
  }),

  mouseDown(e) {
    this._dragStart(e);
  },
  touchStart(e) {
    this._dragStart(e);
  },
  _dragStart(e) {
    const targets = a(['selected', 'selected-padding']);
    if (targets.contains(e.target.className.baseVal)) {
      console.log('panning started!', e.target.className.baseVal);
      // e.preventDefault();
      this._isDragging = true;
    }
  },
  mouseUp(e) {
    this._dragEnd(e);
  },
  touchEnd(e) {
    this._dragEnd(e);
  },
  _dragEnd(e) {
    console.log('dragging stopped', e);
    this._isDragging = false;
  },

  mouseMove(e) {
    if(this._isDragging) {
      this._dragMove(e);
    }
  },
  touchMove(e) {
    if(this._isDragging) {
      this._dragMove(e);
    }
  },
  _dragMove(e) {
    if(this._isDragging) {
      e.preventDefault();
      console.log('panning', e.gesture);
    } else {
      console.log('panning being ignored: ', e.target.className.baseVal);
    }
  },


  panStop(e) {
    if (this._isDragging) {
      this.set('panning stopped', e.target.className.baseVal);
      this._isDragging = false;
    } else {
      console.log('panning ended but no one cared: ', e.target.className.baseVal);
    }
  },

  swipeLeft(e) {
    e.preventDefault();
    this._leftRight(e, 'swipe-left');
  },
  swipeRight(e) {
    this._leftRight(e, 'swipe-right');
  },
  swipeUp(e) {
    e.preventDefault();
    this._upDown(e, 'swipe-up');
  },
  swipeDown(e) {
    e.preventDefault();
    this._upDown(e, 'swipe-down');
  },

  _leftRight(e, code) {
    const {leftRight, isFocused} = this.getProperties('leftRight', 'isFocused');
    const inversion = code.substr(-5) === 'right' ? 1 : -1;
    if(leftRight && isFocused) {
      e.preventDefault();
      const newValue = Number(this.get('value')) + ( inversion * Number(leftRight) );
      this.ddau('onChange', {
        code: code,
        value: newValue,
        oldValue: Number(this.get('value'))
      }, newValue);
    }
  },

  _upDown(e, code) {
    const {upDown, isFocused} = this.getProperties('upDown', 'isFocused');
    const inversion = code.substr(-4) === 'down' ? -1 : 1;
    if(upDown && isFocused) {
      e.preventDefault();
      const newValue = Number(this.get('value')) + ( inversion * Number(upDown) );
      this.ddau('onChange', {
        code: code,
        value: newValue,
        oldValue: Number(this.get('value'))
      }, newValue);
    }
  },


});
