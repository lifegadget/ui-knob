import Ember from 'ember';
import knob from 'ui-knob/components/ui-knob';

export default knob.extend({

  angleOffset: 90,
  angleArc: 180,
  clockwise: false,
  height: Ember.computed('width', function() {
    return this.get('width') / 2;
  }),
  justifyFaceplate: 'start', // puts faceplate to top of DIV
  verticalAdjustment: '-50%', // moves arcs upward by 50% so lower half is visible

});
