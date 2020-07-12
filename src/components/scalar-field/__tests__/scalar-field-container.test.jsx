jest.mock('../scalar-field', () => 'ScalarField');
import React from 'react';
import renderer from 'react-test-renderer';
import ScalarFieldContainer from '../index';

import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import {createFormReducer} from '../../../reducer';
import {NAME} from '../../../constants';

const schema = {type: 'string', title: 'Name'};
const formName = 'test-form';
const loadedState = {
  [NAME]: {
    forms: {
      [formName]: {
        schema: {
          type: 'object',
          properties: {
            name: schema
          }
        },
        data: {
          name: 'Andrew'
        }
      }
    }
  }
};

const reducer = combineReducers({[NAME]: createFormReducer()});
const store = createStore(reducer, loadedState);

describe('ScalarFieldContainer', () => {
  it('renders', () => {
    const props = {
      schema,
      formName,
      path: 'name',
      config: {},
      ui: {},
      onChange: jest.fn(),
      onChangeSilent: jest.fn(),
      onBlur: jest.fn(),
      onFocus: jest.fn()
    };

    const tree = renderer
      .create(
        <Provider store={store}>
          <ScalarFieldContainer {...props} />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
