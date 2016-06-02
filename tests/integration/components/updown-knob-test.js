import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('updown-knob', 'Integration | Component | updown knob', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{updown-knob}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#updown-knob}}
      template block text
    {{/updown-knob}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
