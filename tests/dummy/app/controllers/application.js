import Ember from 'ember';

export default Ember.Controller.extend({

  min: 0,
  max: 100,
  height: 300,
  width:300,
  thickness: 0.3,
  value: 25,
  angleOffset: 10,
  angleArc: 340,
  displayInput: true,
  displayPrevious: true,
  lineCap: 'butt',
  cursor: false,
  bgColor: '#EFEEEE',
  fgColor: '#66CC66',
  backColor: '#fff',
  plateColor: '#fff',
  outline: 0,
  lower: 'thingys',
  upper: '',
  pre: '',
  post: '',
  leftRight: 0,
  upDown: 0,

  actions: {
    showError(hash) {
      console.log(hash);
    }
  }
});
