import Ember from 'ember';

export function inverse(params/*, hash*/) {
  return params[0] * -1;
}

export default Ember.Helper.helper(inverse);
