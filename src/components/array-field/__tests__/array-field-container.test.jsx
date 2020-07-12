jest.mock('../array-field', () => 'ArrayField');
import React from 'react';
import renderer from 'react-test-renderer';
import ArrayFieldContainer from '../index';

import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import {createFormReducer} from '../../../reducer';
import {NAME} from '../../../constants';

const formName = 'test-form';

const schema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      email: {type: 'string'},
      firstName: {type: 'string'},
      lastName: {type: 'string'}
    }
  }
};

const loadedState = {
  [NAME]: {
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
  }
};

const reducer = combineReducers({[NAME]: createFormReducer()});
const store = createStore(reducer, loadedState);

describe('ArrayFieldContainer', () => {
  it('renders', () => {
    const props = {
      schema,
      formName,
      path: 'users',
      config: {}
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
