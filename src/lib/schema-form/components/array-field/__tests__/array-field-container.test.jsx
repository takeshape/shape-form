jest.mock('../array-field', () => 'ArrayField');
import React from 'react';
import renderer from 'react-test-renderer';
import {Map, fromJS} from 'immutable';
import ArrayFieldContainer from '../index';

import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import reducerFactory from '../../../reducer-factory';
import {NAME} from '../../../constants';

const formName = 'test-form';

const schema = fromJS({
  type: 'array',
  items: {
    type: 'object',
    properties: {
      email: {type: 'string'},
      firstName: {type: 'string'},
      lastName: {type: 'string'}
    }
  }
});

const loadedState = {
  [NAME]: fromJS({
    forms: {
      [formName]: {
        schema: {
          type: 'object',
          properties: {
            users: schema
          }
        },
        data: {
          users: [
            {
              email: 'samy@baguette.fr',
              firstName: 'Samy',
              lastName: 'Pessé'
            },
            {
              email: 'ahnold@getothechopper.com',
              firstName: 'Arnold',
              lastName: 'Schwarzenegger'
            },
            {
              email: 'james@bond007.com',
              firstName: 'Sean',
              lastName: 'Connery'
            }
          ]
        }
      }
    }
  })
};

const reducer = combineReducers({[NAME]: reducerFactory()});
const store = createStore(reducer, loadedState);

describe('ArrayFieldContainer', () => {
  it('renders', () => {
    const props = {
      schema,
      formName,
      path: 'users',
      config: Map()
    };

    const tree = renderer
      .create(
        <Provider store={store}>
          <ArrayFieldContainer {...props} />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
