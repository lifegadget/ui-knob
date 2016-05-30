import Ember from 'ember';
import layout from '../templates/components/ui-knob-keyboard';
import { EKMixin, keyDown } from 'ember-keyboard';
import DDAU from '../mixins/ddau';

export default Ember.Component.extend(EKMixin, DDAU, {
  layout,
  tagName: 'event-listener',

  init() {
    this._super(...arguments);
    this.set('keyboardActivated', true);
  },
  leftArrow: Ember.on(keyDown('ArrowLeft'), function() {
    const {leftRight} = this.getProperties('leftRight');
    if(leftRight) {
      const newValue = Number(this.get('value')) - leftRight;
      this.ddau('onChange', {
        code: 'keyboard-increment-left',
        value: newValue,
        oldValue: Number(this.get('value'))
      }, newValue);
    }
  }),

  rightArrow: Ember.on(keyDown('ArrowRight'), function() {
    const {leftRight} = this.getProperties('leftRight');
    if(leftRight) {
      const newValue = Number(this.get('value')) + Number(leftRight);
      this.ddau('onChange', {
        code: 'keyboard-increment-right',
        value: newValue,
        oldValue: Number(this.get('value'))
      }, newValue);
    }
  }),

  upArrow: Ember.on(keyDown('ArrowUp'), function() {
    const {upDown} = this.getProperties('upDown');
    if(upDown) {
      const newValue = Number(this.get('value')) - upDown;
      this.ddau('onChange', {
        code: 'keyboard-increment-up',
        value: newValue,
        oldValue: Number(this.get('value'))
      }, newValue);
    }
  }),

  downArrow: Ember.on(keyDown('ArrowDown'), function() {
    const {upDown} = this.getProperties('upDown');
    if(upDown) {
      const newValue = Number(this.get('value')) + Number(upDown);
      this.ddau('onChange', {
        code: 'keyboard-increment-up',
        value: newValue,
        oldValue: Number(this.get('value'))
      }, newValue);
    }
  }),

});
