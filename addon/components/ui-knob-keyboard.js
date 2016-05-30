import Ember from 'ember';
import layout from '../templates/components/ui-knob-keyboard';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import { EKMixin, keyDown } from 'ember-keyboard';
import DDAU from '../mixins/ddau';

export default Ember.Component.extend(EKMixin, DDAU, RecognizerMixin, {
  layout,
  tagName: 'event-listener',
  recognizers: 'swipe',

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

  swipeLeft(e) {
    this._leftRight(e, 'swipe-left');
  },
  swipeRight(e) {
    this._leftRight(e, 'swipe-right');
  },
  swipeUp(e) {
    this._upDown(e, 'swipe-up');
  },
  swipeDown(e) {
    this._upDown(e, 'swipe-down');
  },

  _leftRight(e, code) {
    const {leftRight} = this.getProperties('leftRight');
    const inversion = code.substr(-5) === 'right' ? 1 : -1;
    if(leftRight) {
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
    const {upDown} = this.getProperties('upDown');
    const inversion = code.substr(-4) === 'down' ? 1 : -1;
    console.log('inversion: ', inversion);
    if(upDown) {
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
