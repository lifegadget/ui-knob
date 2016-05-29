import Ember from 'ember';
import DDAUMixin from 'ui-knob/mixins/ddau';
import { module, test } from 'qunit';

module('Unit | Mixin | ddau');

// Replace this with your real tests.
test('it works', function(assert) {
  let DDAUObject = Ember.Object.extend(DDAUMixin);
  let subject = DDAUObject.create();
  assert.ok(subject);
});
