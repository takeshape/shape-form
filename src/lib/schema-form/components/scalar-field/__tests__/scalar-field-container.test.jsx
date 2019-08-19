jest.mock('../scalar-field', () => 'ScalarField');
import React from 'react';
import renderer from 'react-test-renderer';
import {Map, fromJS} from 'immutable';
import ScalarFieldContainer from '../index';

import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import reducerFactory from '../../../reducer-factory';
import {NAME} from '../../../constants';

const schema = Map({type: 'string', title: 'Name'});
const formName = 'test-form';
const loadedState = {
  [NAME]: fromJS({
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
  })
};

const reducer = combineReducers({[NAME]: reducerFactory()});
const store = createStore(reducer, loadedState);

describe('ScalarFieldContainer', () => {
  it('renders', () => {
    const props = {
      schema,
      formName,
      path: 'name',
      config: Map(),
      ui: Map(),
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
