import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('right-knob', 'Integration | Component | right knob', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{right-knob value=6}}`);

  assert.equal(this.$().text().trim(), '6');

  // Template block usage:
  this.render(hbs`
    {{#right-knob value=6}}

    {{/right-knob}}
  `);

  assert.equal(this.$().text().trim(), '6');
});
