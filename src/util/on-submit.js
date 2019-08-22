import {SUBMIT_FORM} from '../action-types';

export const onFormSubmit = formName => action =>
  action.type === `${SUBMIT_FORM}_SUCCESS` && action.meta.formName === formName;
