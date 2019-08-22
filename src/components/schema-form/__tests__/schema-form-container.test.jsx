jest.mock('../schema-form', () => 'SchemaForm');
import React from 'react';
import renderer from 'react-test-renderer';
import {fromJS} from 'immutable';
import SchemaFormContainer from '../index';

import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import {createFormReducer} from '../../../reducer';
import {NAME} from '../../../constants';

const loadedState = {
  [NAME]: fromJS({
    forms: {
      'test-form': {
        schema: {
          type: 'object',
          properties: {
            name: {type: 'string'}
          }
        }
      }
    }
  })
};

const reducer = combineReducers({[NAME]: createFormReducer()});
const store = createStore(reducer, loadedState);

describe('SchemaFormContainer', () => {
  it('renders', () => {
    const props = {
      formName: 'test-form',
      registerForm: jest.fn(),
      submitForm: jest.fn(),
      clearForm: jest.fn()
    };

    const tree = renderer
      .create(
        <Provider store={store}>
          <SchemaFormContainer {...props} />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
