/* jshint node: true */
'use strict';

module.exports = {
  name: 'ui-knob',
  description: 'Knob input control for ambitious ember apps',
  included: function(app) {
    app.import('bower_components/jquery-knob/js/jquery.knob.js');
  }
};
