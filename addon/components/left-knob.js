import Ember from 'ember';
import knob from 'ui-knob/components/ui-knob';

export default knob.extend({

  angleOffset: 180,
  angleArc: 180,
  clockwise: false,
  alignFaceplate: 'end', // puts faceplate to top of DIV
  _width: Ember.computed('width', function() {
    return this.get('width') / 2;
  })
});
