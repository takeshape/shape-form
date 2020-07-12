import {removeIn, setIn} from '../util/immutable-util';

jest.mock('../util/structural-changes');
import {NAME} from '../constants';
import {getValues, getStructuralChanges} from '../selectors';
import {PROPERTIES} from '../paths';
import get from 'lodash/get';

import {flattenStructuralChanges} from '../util/structural-changes';
import produce, {setAutoFreeze} from 'immer';
flattenStructuralChanges.mockImplementation((...args) => args);

setAutoFreeze(false);

const formData = {
  email: 'ahnald@dapump.com',
  fullName: 'Arnold Schwarzenegger',
  addresses: [
    {
      street: 'Pineapple',
      city: 'Brooklyn',
      zip: '11201'
    }
  ]
};

const formState = {
  forms: {
    testForm: {
      schema: {
        type: 'object',
        properties: {
          email: {type: 'string'},
          fullName: {type: 'string'},
          addresses: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                street: {type: 'string'},
                city: {type: 'string'},
                zip: {type: 'string'}
              }
            }
          }
        }
      },
      initialData: {
        email: 'arnold@dapump.com',
        fullName: 'Arnold Schwarzenegger'
      },
      data: formData,
      errors: {},
      submitErrors: {},
      structuralChanges: {
        addresses: {
          [PROPERTIES]: {
            arrayKeys: [0],
            originalSize: 1
          }
        }
      },
      dirty: new Set(['email', 'addresses']),
      touched: new Set(['email']),
      submitted: false
    }
  }
};

function getState(domainState) {
  return {[NAME]: domainState};
}

test('getValues', () => {
  const values = getValues(getState(formState), {formName: 'testForm'});
  expect(values).toEqual(formData);
});

test('getValues - onlyDirty', () => {
  const dirtyFormState = produce(formState, draft => {
    const {testForm} = draft.forms;
    testForm.dirty = new Set(['email', 'addresses[0].street']);
    setIn(testForm.data, ['addresses', 0, 'street'], undefined);
  });

  const values = getValues(getState(dirtyFormState), {
    formName: 'testForm',
    onlyDirty: true
  });

  expect(values).toEqual({
    email: 'ahnald@dapump.com',
    addresses: [
      {
        street: null,
        city: 'Brooklyn',
        zip: '11201'
      }
    ]
  });
});

test('getStructuralChanges - no changes', () => {
  expect(getStructuralChanges(getState(formState), {formName: 'testForm'})).toEqual([
    get(formState, ['forms', 'testForm', 'structuralChanges']),
    [],
    []
  ]);
});

test('getStructuralChanges', () => {
  const state = getState(produce(formState, draft => removeIn(draft, ['forms', 'testForm', 'structuralChanges'])));
  expect(getStructuralChanges(state, {formName: 'testForm'})).toEqual([]);
});
