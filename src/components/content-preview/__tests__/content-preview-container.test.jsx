jest.mock('../content-preview', () => 'ContentPreview');
import React from 'react';
import renderer from 'react-test-renderer';
import {Map, fromJS} from 'immutable';
import ContentPreviewContainer from '../index';

import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import {createFormReducer} from '../../../reducer';
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

const reducer = combineReducers({[NAME]: createFormReducer()});
const store = createStore(reducer, loadedState);

describe('ScalarFieldContainer', () => {
  it('renders', () => {
    const props = {
      schema,
      formName,
      path: 'name'
    };

    const tree = renderer
      .create(
        <Provider store={store}>
          <ContentPreviewContainer {...props} />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
