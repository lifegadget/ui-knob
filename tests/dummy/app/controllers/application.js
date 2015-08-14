import Ember from 'ember';

export default Ember.Controller.extend({

  min: 0,
  max: 100,
  height: 150,
  width:150,
  thickness: 0.3,
  value: 25,
  angleOffset: 10,
  angleArc: 340,
  displayInput: true,
  displayPrevious: true,
  lineCap: 'butt',
  cursor: false,
  bgColor: '#EFEEEE',
  fgColor: '#66CC66'
});
