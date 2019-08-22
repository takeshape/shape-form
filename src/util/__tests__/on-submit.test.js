import {onFormSubmit} from '../on-submit';
import {blurField} from '../../actions';
import {SUBMIT_FORM} from '../../action-types';

function submitFormSuccess(formName) {
  return {type: `${SUBMIT_FORM}_SUCCESS`, meta: {formName}};
}

test('onFormSubmit', () => {
  const formName = 'TEST_FORM';
  const predicate = onFormSubmit(formName);
  expect(predicate(submitFormSuccess(formName))).toBe(true);
  expect(predicate(submitFormSuccess('OTHER_FORM'))).toBe(false);
  expect(predicate(blurField(formName))).toBe(false);
});
