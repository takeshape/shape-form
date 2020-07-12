import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
const renderer = new ReactShallowRenderer();
import ContentPreview from '../content-preview';

describe('ContentPreview', () => {
  it('renders', () => {
    const props = {
      value: 'Andrew',
      schema: {type: 'string', title: 'Name'},
      formName: 'test-form',
      path: 'name',
      config: {},

      onChange: jest.fn(),
      onChangeSilent: jest.fn(),
      onBlur: jest.fn(),
      onFocus: jest.fn()
    };

    const tree = renderer.render(<ContentPreview {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders custom widget', () => {
    const props = {
      value: 'Andrew',
      schema: {type: 'string', title: 'Name'},
      formName: 'test-form',
      path: 'name',
      config: {preview: 'customPreview'},
      widgets: {
        customPreview({value}) { // eslint-disable-line
          return <div>{value}</div>;
        }
      },

      onChange: jest.fn(),
      onChangeSilent: jest.fn(),
      onBlur: jest.fn(),
      onFocus: jest.fn()
    };

    const tree = renderer.render(<ContentPreview {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('falls back on DefaultContentPreview if the configured widget is undefined', () => {
    const props = {
      value: 'Andrew',
      schema: {type: 'string', title: 'Name'},
      formName: 'test-form',
      path: 'name',
      config: {},
      widgets: {},

      onChange: jest.fn(),
      onChangeSilent: jest.fn(),
      onBlur: jest.fn(),
      onFocus: jest.fn()
    };

    const tree = renderer.render(<ContentPreview {...props} />);
    expect(tree).toMatchSnapshot();
  });
});
