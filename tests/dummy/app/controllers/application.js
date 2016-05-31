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
  lineCap: 'butt',
  lower:'',
  upper:'',
  actions: {
    onChange(hash) {
      this.set('value', hash.value);
      const flashMessages = Ember.get(this, 'flashMessages');
      flashMessages.success(htmlSafe(`<b>${hash.code}</b> caused a <i>onChange</i> event where the value moved from <b>${hash.oldValue}</b> to <b>${hash.value}</b>. Check the developer console for full details.`));
      console.log('onChange action was fired', hash);
    },
    onError(hash) {
      const flashMessages = Ember.get(this, 'flashMessages');
      flashMessages.danger(htmlSafe(`The <b>${hash.code}</b> code was sent via the <i>onError</i> action handler. Check the developer console for full details.`), {sticky: true});
      console.warn('onError action was fired', hash);
    },
    onFocus(hash) {
      const flashMessages = Ember.get(this, 'flashMessages');
      flashMessages.info(htmlSafe(`The <b>${hash.code}</b> code was sent on the <i>onFocus</i> action handler. Check the developer console for full details.`));
      console.info('onError action was fired', hash);
    }
  }
});
