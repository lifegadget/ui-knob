import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ui-knob-input-plate', 'Integration | Component | ui knob input plate', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ui-knob-input-plate}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ui-knob-input-plate}}
      template block text
    {{/ui-knob-input-plate}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
