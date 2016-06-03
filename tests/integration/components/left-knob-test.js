import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('left-knob', 'Integration | Component | left knob', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{left-knob value=5}}`);

  assert.equal(this.$().text().trim(), '5');

  // Template block usage:
  this.render(hbs`
    {{#left-knob value=5}}
      template block text5
    {{/left-knob}}
  `);

  assert.equal(this.$().text().trim(), '5');
});
