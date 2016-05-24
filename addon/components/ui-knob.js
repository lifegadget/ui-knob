import Ember from 'ember';
import { arc, pie } from 'd3-shape';

const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line
import layout from '../templates/components/ui-knob';
import Stylist from 'ember-cli-stylist/mixins/shared-stylist';
const apiSurface = ['min','max','step','angleOffset','angleArc','stopper','readOnly','rotation','cursor','thickness','lineCap','width','height','dataWidth', 'displayInput','displayPrevious','fgColor','bgColor','inputColor','font','fontWeight','skin'];

export default Ember.Component.extend(Stylist,{
  layout,
  tagName: '',
  type: 'text',
  value: 0,

  // Behaviour props
  min: 0,
  max: 10,
  angleOffset: 10,
  angleArc: 340,
  stopper: true,
  step: 1,
  readOnly: false,
  rotation: 'clockwise',
  // UI related props
  cursor: false, // set to a number to have a partial line show instead of a "total line"
  thickness: 0.3,
  lineCap: 'butt', // can also be "round"
  width: 100,
  hasDirectInput: false, // show a text input box
  uom: null,
  skin: 'tron',
  uomColor: 'grey',
  uomVerticalPosition: 0,
  uomStyle: computed('uomColor','width','uomVerticalPosition', function() {
    var prop = this.getProperties('uomColor','width','uomVerticalPosition');
    return 'color: ' + prop.uomColor + ';' + ' width: ' + prop.width + 'px; ' +'bottom: ' + prop.uomVerticalPosition + 'px; ';
  }),
  hasUom: Ember.computed.bool('uom'),
  height: 100,
  displayInput: true,
  displayPrevious: true,
  fgColor: '#66CC66',
  bgColor: '#EFEEEE',
  inputColor: 'black',
  font: 'Arial',
  fontWeight: 'normal',

  didInsertElement() {
    this._super(...arguments);
    var data = [1, 13];

    var canvas = document.querySelector("canvas"),
        context = canvas.getContext("2d");

    var width = canvas.width,
        height = canvas.height,
        radius = Math.min(width, height) / 2;

    var colors = [
      "#1f77b4", "#dedbdb","#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
      "#8c564b", "#e377c2", , "#bcbd22", "#17becf"
    ];

    var outerRadius = radius - 10,
        cornerRadius = 0;

    const clicked = function(i) {
      console.log(i);
    };

    var myarc = arc()
        .outerRadius(outerRadius)
        .innerRadius(150)
        .on('click', clicked)
        // .startAngle(0.5 * Math.PI)
        // .endAngle(2.0 * Math.PI)
        .cornerRadius(cornerRadius)
        .context(context);

    var p = pie();

    var arcs = p(data);

    context.translate(width / 2, height / 2);

    context.globalAlpha = 0.5;
    arcs.forEach(function(d, i) {
      context.beginPath();
      myarc(d);
      context.fillStyle = colors[i];
      context.fill();
    });

    context.globalAlpha = 1;
    context.beginPath();
    arcs.forEach(myarc);
    context.lineWidth = 1.5;
    context.strokeStyle = "#fff";
    context.stroke();

    function corner(angle, radius, sign) {
      context.save();
      context.translate(
        sign * cornerRadius * Math.cos(angle) + Math.sqrt(radius * radius - cornerRadius * cornerRadius) * Math.sin(angle),
        sign * cornerRadius * Math.sin(angle) - Math.sqrt(radius * radius - cornerRadius * cornerRadius) * Math.cos(angle)
      );
      // circle.outerRadius(cornerRadius - 1.5)();
      context.restore();
    }
  }

});
