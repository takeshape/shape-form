import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import WysiwygSingleLineText from '../wysiwyg-single-line-text';

const renderer = new ShallowRenderer();

describe('WysiwygSingleLineText', () => {
  it('renders', () => {
    const props = {
      value: {},
      onChangeSilent: jest.fn(),
      onBlur: jest.fn(),
      schema: {}
    };

    expect(renderer.render(<WysiwygSingleLineText {...props} />)).toMatchSnapshot();
  });

  it('renders when disabled', () => {
    const props = {
      value: {},
      onChangeSilent: jest.fn(),
      onBlur: jest.fn(),
      disabled: true,
      schema: {}
    };

    expect(renderer.render(<WysiwygSingleLineText {...props} />)).toMatchSnapshot();
  });
});
