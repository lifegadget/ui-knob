import Ember from 'ember';
import knob from 'ui-knob/components/ui-knob';

export default knob.extend({

  angleOffset: -90,
  angleArc: 180,
  height: Ember.computed('width', function() {
    return this.get('width') / 2;
  }),
  justifyFaceplate: 'end', // puts faceplate to bottom of DIV
});
