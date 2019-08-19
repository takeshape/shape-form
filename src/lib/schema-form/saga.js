import {takeLatest, take, put, call, all, select, fork} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import {getForm, getStructuralChanges, getValues} from './selectors';

import {CHANGE_FIELD, BLUR_FIELD, VALIDATE_FORM, SUBMIT_FORM, ADD_ARRAY_ITEM, SWAP_ARRAY_ITEMS} from './action-types';
import {validateForm} from './actions';

const pauseChanges = new Set([CHANGE_FIELD, SWAP_ARRAY_ITEMS]);
export function* validateOnChange(action) {
  if (action.type === SUBMIT_FORM) {
    return;
  }
  if (pauseChanges.has(action.type)) {
    yield call(delay, 500);
  }
  yield put({type: VALIDATE_FORM, meta: action.meta});
}

export function* submitFormSaga(action) {
  const {formName, onlyDirty, withValues} = action.meta;
  yield put(validateForm(formName));
  const form = yield select(getForm, {formName});

  const errors = form.get('errors');
  const hasErrors = errors && errors.size;
  yield put({type: `${VALIDATE_FORM}_FULFILLED`, meta: {formName}, payload: errors});
  if (hasErrors) {
    yield put({type: `${SUBMIT_FORM}_FAILURE`, meta: {formName}, payload: {errors}});
  } else {
    let payload;
    if (action.callback || withValues) {
      payload = yield select(getValues, {formName, onlyDirty});
      const structuralChanges = yield select(getStructuralChanges, {formName});
      if (structuralChanges.length) {
        payload._structure = structuralChanges;
      }
    }

    yield put({type: `${SUBMIT_FORM}_SUCCESS`, payload, meta: {formName}});

    if (action.callback) {
      action.callback(payload);
    }
  }
}

export default function* root() {
  yield all([
    fork(takeLatest, [...pauseChanges, SUBMIT_FORM, BLUR_FIELD, ADD_ARRAY_ITEM], validateOnChange),
    fork(takeLatest, SUBMIT_FORM, submitFormSaga)
  ]);
}

export function* waitForFormSubmit(formName) {
  while (true) {
    const action = yield take([`${SUBMIT_FORM}_SUCCESS`, `${SUBMIT_FORM}_FAILURE`]);
    if (action.meta.formName === formName) {
      return action;
    }
  }
}
