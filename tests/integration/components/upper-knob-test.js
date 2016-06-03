import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('upper-knob', 'Integration | Component | upper knob', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{upper-knob value=2}}`);

  assert.equal(this.$().text().trim(), '2');

  // Template block usage:
  this.render(hbs`
    {{#upper-knob value=2}}
    {{/upper-knob}}
  `);

  assert.equal(this.$().text().trim(), '2');
});
