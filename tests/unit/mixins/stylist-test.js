import Ember from 'ember';
import StylistMixin from 'ui-knob/mixins/stylist';
import { module, test } from 'qunit';

module('Unit | Mixin | stylist');

// Replace this with your real tests.
test('it works', function(assert) {
  var StylistObject = Ember.Object.extend(StylistMixin);
  var subject = StylistObject.create();
  assert.ok(subject);
});
