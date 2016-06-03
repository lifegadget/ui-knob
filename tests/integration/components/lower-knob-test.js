import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('lower-knob', 'Integration | Component | lower knob', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{lower-knob value=3}}`);

  assert.equal(this.$().text().trim(), '3');

  // Template block usage:
  this.render(hbs`
    {{#lower-knob value=3}}
      
    {{/lower-knob}}
  `);

  assert.equal(this.$().text().trim(), '3');
});
