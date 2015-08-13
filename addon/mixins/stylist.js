import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line
const htmlSafe = Ember.String.htmlSafe;
const dasherize = Ember.String.dasherize;
const _styleProperties = ['maxWidth', 'width', 'minWidth','height','fontSize','fontFamily','fontWeight','fontStyle','color','backgroundColor','borderColor','outlineColor','zIndex','opacity'];
const _attributeUnbinding = ['style'];
const GOLDEN_RATIO = 1.618;
const ASPECT_RATIO = 1.3;

var StyleSupport = Ember.Mixin.create({
  classNameBindings: ['_textAlignClass'],

  // HTML STYLE PROPS
  _propertyUnset: _attributeUnbinding,
  _style: computed(..._styleProperties, function() {
    const styles = this.getProperties(..._styleProperties);
    const sizer = size => {
      return Number(size) === size ? size + 'px' : size;
    };

    const stylist = (style, value) => {
      switch(style) {
        case 'fontSize':
        case 'width':
        case 'minWidth':
        case 'maxWidth':
        return sizer(value);
        case 'height':
        let width = this.get('width');
        if(!width || String(width).substr(-2) !== 'px') {
          return sizer(value);
        }
        width = width.substr(0,width.length - 2);
        if(value === 'golden') {
         return width / GOLDEN_RATIO + 'px';
        } else if (value === 'square' && this.get('width')) {
          return width / ASPECT_RATIO + 'px';
        } else {
          return sizer(value);
        }
        return value;
        default:
        return value;
      }
    };
    return htmlSafe(keys(styles).filter( key => {
      return styles[key];
    }).map( key => {
      return dasherize(key) + ': ' + stylist(key, get(this,key));
    }).join('; '));
  }),
  _attributeRemapping: on('init', function() {
    const props =_attributeUnbinding;
    props.map( prop => {
      new A(this.get('attributeBindings')).removeObject(prop);
    });
  })

});

StyleSupport[Ember.NAME_KEY] = 'Stylist';
export default StyleSupport;
