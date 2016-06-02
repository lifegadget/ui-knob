import Ember from 'ember';
const htmlSafe = Ember.String.htmlSafe;

export default Ember.Controller.extend({
  flashMessages: Ember.inject.service(),

  min: 0,
  max: 30,
  step: 1,
  height: 300,
  width:300,
  thickness: 40,
  value: 10,
  angleOffset: 10,
  angleArc: 340,
  displayInput: true,
  displayPrevious: true,
  lower:'',
  upper:'',
  clockwise: true,

  uknob: 3,
  lrknob: 4,
  udknob: null,
  time: '13:35',

  actions: {
    onChange(hash) {
      this.set('value', hash.value);
      const flashMessages = Ember.get(this, 'flashMessages');
      flashMessages.success(htmlSafe(`<b>${hash.code}</b> caused a <i>onChange</i> event where the value moved from <b>${hash.oldValue}</b> to <b>${hash.value}</b>. Check the developer console for full details.`));
      console.log('onChange action was fired', hash);
    },
    onError(hash) {
      const flashMessages = Ember.get(this, 'flashMessages');
      flashMessages.danger(htmlSafe(`The <b>${hash.code}</b> code was sent via the <i>onError</i> action handler [${hash.context.elementId}]. Check the developer console for full details. Click here to remove this error message.`), {sticky: true});
      console.warn('onError action was fired', hash);
    },
    onFocus(hash) {
      const flashMessages = Ember.get(this, 'flashMessages');
      flashMessages.info(htmlSafe(`The <b>${hash.code}</b> code was received on the <i>onFocus</i> action handler.`));
      console.info('onFocus action was fired', hash);
    },

    compositeError(hash) {
      const flashMessages = Ember.get(this, 'flashMessages');
      flashMessages.danger(htmlSafe(`The <b>${hash.code}</b> code was sent via the <i>onError</i> action handler on the <b>${hash.knob}</b> knob. Check the developer console for full details. Click here to remove this error message.`), {sticky: false});
      console.warn('onError action was fired', hash);
    },

    compositeChange(hash) {
      this.set('udknob', Ember.$.extend({}, hash.value));
      const flashMessages = Ember.get(this, 'flashMessages');
      flashMessages.success(htmlSafe(`<b>${hash.code}</b> caused a <i>onChange</i> event where the value moved from <b>${hash.oldValue}</b> to <b>${hash.value}</b>. Check the developer console for full details.`));
      console.log('onChange action was fired', hash);
    },
  }
});
