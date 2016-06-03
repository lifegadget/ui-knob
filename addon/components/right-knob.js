// import Ember from 'ember';
import knob from 'ui-knob/components/ui-knob';

export default knob.extend({

  angleOffset: 0,
  angleArc: 180,
  clockwise: true,
  alignFaceplate: 'start', // puts faceplate to top of DIV
  horizontalAdjustment: '-50%', // moves arcs leftward by 50% and reduce DIV width by 50%

});
