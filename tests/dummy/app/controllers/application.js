import Ember from 'ember';

export default Ember.Controller.extend({

  min: 0,
  max: 30,
  step: 1,
  height: 300,
  width:300,
  thickness: 0.3,
  value: 10,
  angleOffset: 10,
  angleArc: 340,
  displayInput: true,
  displayPrevious: true,
  lineCap: 'butt',
  cursor: false,
  unselectedColor: '#EFEEEE',
  selectedColor: '#66CC66',

  actions: {
    onError(hash) {
      console.error(hash);
    }
  }
});
