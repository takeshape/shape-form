import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
const renderer = new ReactShallowRenderer();
import {Map, OrderedMap, fromJS} from 'immutable';
import DefaultContentPreview from '../default-content-preview';

describe('DefaultContentPreview', () => {
  it('renders string', () => {
    const props = {
      value: 'Andrew',
      schema: Map({type: 'string', title: 'Name'}),
      config: Map()
    };

    const tree = renderer.render(<DefaultContentPreview {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders number', () => {
    const props = {
      value: 7,
      schema: Map({type: 'number', title: 'Lucky Number'}),
      config: Map()
    };

    const tree = renderer.render(<DefaultContentPreview {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders object', () => {
    const props = {
      value: Map({
        email: 'andrew@takeshape.io',
        firstName: 'Andrew',
        lastName: 'Sprouse'
      }),
      schema: Map({
        type: 'object',
        properties: OrderedMap([
          ['email', Map({type: 'string'})],
          ['firstName', Map({type: 'string'})],
          ['lastName', Map({type: 'string'})]
        ])
      }),
      config: Map()
    };

    const tree = renderer.render(<DefaultContentPreview {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders object with order config', () => {
    const props = {
      value: Map({
        email: 'andrew@takeshape.io',
        firstName: 'Andrew',
        lastName: 'Sprouse'
      }),
      schema: Map({
        type: 'object',
        properties: OrderedMap([
          ['email', Map({type: 'string'})],
          ['firstName', Map({type: 'string'})],
          ['lastName', Map({type: 'string'})]
        ])
      }),
      config: fromJS({order: ['lastName', 'firstName', 'email']})
    };

    const tree = renderer.render(<DefaultContentPreview {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders with no content', () => {
    const props = {
      value: Map({}),
      schema: Map({
        type: 'object',
        properties: OrderedMap([
          ['email', Map({type: 'string'})],
          ['firstName', Map({type: 'string'})],
          ['lastName', Map({type: 'string'})]
        ])
      }),
      config: fromJS({order: ['lastName', 'firstName', 'email']})
    };

    const tree = renderer.render(<DefaultContentPreview {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders object with long string', () => {
    const props = {
      value: Map({
        content:
          'Cronut knausgaard bespoke green juice kitsch. DIY lyft four loko ethical bespoke meggings quinoa tousled 3 wolf moon lomo.'
      }),
      schema: fromJS({
        type: 'object',
        properties: {
          content: {type: 'string'}
        }
      }),
      config: Map()
    };

    const tree = renderer.render(<DefaultContentPreview {...props} />);
    expect(tree).toMatchSnapshot();
  });
});
