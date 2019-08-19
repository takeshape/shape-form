import {put, take, select, call, all, takeLatest, fork} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import root, {validateOnChange, submitFormSaga, waitForFormSubmit} from '../saga';
import {ADD_ARRAY_ITEM, BLUR_FIELD, CHANGE_FIELD, SUBMIT_FORM, SWAP_ARRAY_ITEMS, VALIDATE_FORM} from '../action-types';
import {validateForm, submitForm, changeField, swapArrayItems} from '../actions';
import {getForm, getStructuralChanges, getValues} from '../selectors';
import {fromJS, Set} from 'immutable';
import {createAction} from 'redux-actions';

const SUBMIT_FORM_FULFILLED = `${SUBMIT_FORM}_SUCCESS`;
const SUBMIT_FORM_FAILURE = `${SUBMIT_FORM}_FAILURE`;

test('validateOnChange - pause before validate on CHANGE_FIELD', () => {
  const formName = 'formName';
  const action = changeField(formName, 'fieldPath')();
  const gen = validateOnChange(action);

  expect(gen.next().value).toEqual(call(delay, 500));
  expect(gen.next().value).toEqual(put({type: VALIDATE_FORM, meta: action.meta}));
});

test('validateOnChange - pause before validate on SWAP_ARRAY_ITEMS', () => {
  const formName = 'formName';
  const action = swapArrayItems(formName, 'fieldPath');
  const gen = validateOnChange(action);

  expect(gen.next().value).toEqual(call(delay, 500));
  expect(gen.next().value).toEqual(put({type: VALIDATE_FORM, meta: action.meta}));
});

test('validateOnChange - no pause before validate on BLUR_FIELD, ADD_ARRAY_ITEM', () => {
  [BLUR_FIELD, ADD_ARRAY_ITEM].forEach(actionType => {
    const action = createAction(actionType)();
    const gen = validateOnChange(action);

    expect(gen.next().value).toEqual(put({type: VALIDATE_FORM, meta: action.meta}));
  });
});

test('validateOnChange - no-op for SUBMIT_FORM', () => {
  const action = createAction(SUBMIT_FORM)();
  const gen = validateOnChange(action);

  expect(gen.next().value).toEqual(undefined);
});

test('root - take latest for validate changes', () => {
  const gen = root();
  expect(gen.next().value).toEqual(
    all([
      fork(takeLatest, [CHANGE_FIELD, SWAP_ARRAY_ITEMS, SUBMIT_FORM, BLUR_FIELD, ADD_ARRAY_ITEM], validateOnChange),
      fork(takeLatest, SUBMIT_FORM, submitFormSaga)
    ])
  );
});

test('submitFormSaga - validation errors', () => {
  const formName = 'testForm';
  const action = submitForm({formName});
  const gen = submitFormSaga(action);

  expect(gen.next().value).toEqual(put(validateForm(formName)));
  expect(gen.next().value).toEqual(select(getForm, {formName}));

  const errors = fromJS({
    email: 'Must be valid email address'
  });

  const form = fromJS({
    data: {
      email: 'bogus'
    },
    errors
  });

  expect(gen.next(form).value).toEqual(put({type: `${VALIDATE_FORM}_FULFILLED`, meta: {formName}, payload: errors}));
  expect(gen.next().value).toEqual(put({type: `${SUBMIT_FORM}_FAILURE`, meta: {formName}, payload: {errors}}));
  expect(gen.next().done).toBe(true);
});

test('submitFormSaga - success', () => {
  const formName = 'testForm';
  const action = submitForm({formName});
  const gen = submitFormSaga(action);

  expect(gen.next().value).toEqual(put(validateForm(formName)));
  expect(gen.next().value).toEqual(select(getForm, {formName}));

  const form = fromJS({
    data: {
      email: 'samy@baguette.fr',
      fullName: 'Samy Pessé'
    }
  });

  expect(gen.next(form).value).toEqual(put({type: `${VALIDATE_FORM}_FULFILLED`, meta: {formName}}));
  expect(gen.next().value).toEqual(put({type: `${SUBMIT_FORM}_SUCCESS`, meta: {formName}}));
  expect(gen.next().done).toBe(true);
});

test('submitFormSaga - success callback', () => {
  const formName = 'testForm';
  const callback = jest.fn();
  const action = submitForm({formName, callback});
  const gen = submitFormSaga(action);

  expect(gen.next().value).toEqual(put(validateForm(formName)));
  expect(gen.next().value).toEqual(select(getForm, {formName}));

  const form = fromJS({
    data: {
      email: 'samy@baguette.fr',
      fullName: 'Samy Pessé'
    }
  });

  expect(gen.next(form).value).toEqual(put({type: `${VALIDATE_FORM}_FULFILLED`, meta: {formName}}));
  expect(gen.next().value).toEqual(select(getValues, {formName}));

  const values = form.get('data').toJS();
  expect(gen.next(values).value).toEqual(select(getStructuralChanges, {formName}));
  const structure = [];
  expect(gen.next(structure).value).toEqual(put({type: `${SUBMIT_FORM}_SUCCESS`, meta: {formName}, payload: values}));
  expect(gen.next().done).toBe(true);

  expect(callback).toHaveBeenCalledWith(values);
});

test('submitFormSaga - withValues', () => {
  const formName = 'testForm';
  const action = submitForm({formName, withValues: true, onlyDirty: true});
  const gen = submitFormSaga(action);

  expect(gen.next().value).toEqual(put(validateForm(formName)));
  expect(gen.next().value).toEqual(select(getForm, {formName}));

  const form = fromJS({
    data: {
      email: 'samy@baguette.fr',
      fullName: 'Samy Pessé'
    },
    dirty: Set.of('email')
  });

  expect(gen.next(form).value).toEqual(put({type: `${VALIDATE_FORM}_FULFILLED`, meta: {formName}}));
  expect(gen.next().value).toEqual(select(getValues, {formName, onlyDirty: true}));

  const values = {
    email: 'samy@baguette.fr'
  };
  expect(gen.next(values).value).toEqual(select(getStructuralChanges, {formName}));
  const structure = [
    {
      path: 'repeater',
      structure: [1, 0]
    }
  ];
  expect(gen.next(structure).value).toEqual(
    put({
      type: `${SUBMIT_FORM}_SUCCESS`,
      meta: {formName},
      payload: {
        _structure: [
          {
            path: 'repeater',
            structure: [1, 0]
          }
        ],
        ...values
      }
    })
  );
  expect(gen.next().done).toBe(true);
});

test('waitForFormSubmit', () => {
  const formName = 'test-form-woo';
  const gen = waitForFormSubmit(formName);

  const takeEffect = take([SUBMIT_FORM_FULFILLED, SUBMIT_FORM_FAILURE]);
  expect(gen.next().value).toEqual(takeEffect);

  const action1 = {
    type: SUBMIT_FORM_FULFILLED,
    meta: {
      formName: 'another-form-1'
    }
  };

  expect(gen.next(action1).value).toEqual(takeEffect);

  const action2 = {
    type: SUBMIT_FORM_FULFILLED,
    meta: {
      formName: 'another-form-2'
    }
  };
  expect(gen.next(action2).value).toEqual(takeEffect);

  const targetAction = {type: SUBMIT_FORM_FULFILLED, meta: {formName}};
  expect(gen.next(targetAction)).toEqual({
    value: targetAction,
    done: true
  });
});
