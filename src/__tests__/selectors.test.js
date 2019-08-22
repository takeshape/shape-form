jest.mock('../util/structural-changes');
import {NAME} from '../constants';
import {getValues, getStructuralChanges} from '../selectors';
import {fromJS, Set} from 'immutable';
import {PROPERTIES} from '../paths';

import {flattenStructuralChanges} from '../util/structural-changes';
flattenStructuralChanges.mockImplementation((...args) => args);

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

const formState = fromJS({
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
      dirty: Set.of('email', 'addresses'),
      touched: Set.of('email'),
      submitted: false
    }
  }
});

function getState(domainState) {
  return {[NAME]: domainState};
}

test('getValues', () => {
  const values = getValues(getState(formState), {formName: 'testForm'});
  expect(values).toEqual(formData);
});

test('getValues - onlyDirty', () => {
  const dirtyFormState = formState.updateIn(['forms', 'testForm'], form => {
    return form.merge({
      data: form.get('data').setIn(['addresses', 0, 'street'], undefined),
      dirty: Set.of('email', 'addresses[0].street')
    });
  });
  const values = getValues(getState(dirtyFormState), {
    formName: 'testForm',
    onlyDirty: true
  });
  const expected = {
    email: 'ahnald@dapump.com',
    addresses: [
      {
        street: null,
        city: 'Brooklyn',
        zip: '11201'
      }
    ]
  };
  expect(values).toEqual(expected);
});

test('getStructuralChanges', () => {
  expect(getStructuralChanges(getState(formState), {formName: 'testForm'})).toEqual([
    formState.getIn(['forms', 'testForm', 'structuralChanges']),
    [],
    []
  ]);
});

test('getStructuralChanges', () => {
  const state = getState(formState.removeIn(['forms', 'testForm', 'structuralChanges']));
  expect(getStructuralChanges(state, {formName: 'testForm'})).toEqual([]);
});
