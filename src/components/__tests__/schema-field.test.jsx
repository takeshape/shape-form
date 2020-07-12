import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
const renderer = new ReactShallowRenderer();

import SchemaField from '../schema-field';
import DefaultWidget from '../default-widget';

describe('SchemaField', () => {
  it('renders scalar field', () => {
    const props = {
      schema: {type: 'string'},
      config: {},
      formName: 'default',
      path: 'text'
    };

    const tree = renderer.render(<SchemaField {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders array field', () => {
    const props = {
      schema: {type: 'array'},
      config: {},
      formName: 'default',
      path: 'text'
    };

    const tree = renderer.render(<SchemaField {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders object field', () => {
    const props = {
      schema: {
        type: 'object',
        properties: {
          email: {type: 'string'},
          firstName: {type: 'string'},
          lastName: {type: 'string'}
        }
      },
      config: {},
      formName: 'default',
      path: 'user'
    };

    const tree = renderer.render(<SchemaField {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders scalar field with custom widget', () => {
    const props = {
      schema: {type: 'string', title: 'Text Input'},
      config: {widget: 'text'},
      widgets: {
        text: DefaultWidget
      },
      formName: 'default',
      path: 'text'
    };

    const tree = renderer.render(<SchemaField {...props} />);
    expect(tree).toMatchSnapshot();
  });
});
