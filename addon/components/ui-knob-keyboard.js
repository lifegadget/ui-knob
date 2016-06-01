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
  recognizers: 'swipe pan vertical-swipe',

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

  click(e) {
    e.preventDefault();
    console.log('clicked', e.target.className.baseVal);
  },

  panStart(e) {
    e.preventDefault(e);
    if (e.target.className.baseVal === 'selected') {
      console.log('pan starting', e);
      this.set('panning', true);
    } else {
      console.log('panning blocked');
    }
  },

  panMove(e) {
    e.preventDefault();
    if (e.target.className.baseVal === 'selected') {
      console.log('panning', e);
      console.log(e.target.classList);
    } else {
      console.log(e.target.className.baseVal);
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
