import React from 'react';
import {fromJS} from 'immutable';
import SingleLineTextWidget from '../single-line-text';
import ReactShallowRenderer from 'react-test-renderer/shallow';
const renderer = ReactShallowRenderer.createRenderer();

describe('SingleLineTextWidget', () => {
  it('renders', () => {
    const props = {
      schema: fromJS({
        title: 'Test Title'
      }),
      config: fromJS({
        // instructions: 'The quick brown fox jumps over the lazy dog. See [dogs](http://example.com/)'
      }),
      onChange: jest.fn(),
      onBlur: jest.fn(),
      value: 'Brown Fox'
    };

    const tree = renderer.render(<SingleLineTextWidget {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders with instructions', () => {
    const props = {
      schema: fromJS({
        title: 'Test Title'
      }),
      config: fromJS({
        instructions: 'The quick brown fox jumps over the lazy dog. See [dogs](http://example.com/)'
      }),
      onChange: jest.fn(),
      onBlur: jest.fn(),
      value: 'Brown Fox'
    };

    const tree = renderer.render(<SingleLineTextWidget {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders with description', () => {
    const props = {
      schema: fromJS({
        title: 'Test Title',
        description: 'The quick brown fox jumps over the lazy dog.'
      }),
      config: fromJS({}),
      onChange: jest.fn(),
      onBlur: jest.fn(),
      value: 'Brown Fox'
    };

    const tree = renderer.render(<SingleLineTextWidget {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders with maxLength', () => {
    const props = {
      schema: fromJS({
        title: 'Test Title',
        maxLength: 20
      }),
      config: fromJS({}),
      onChange: jest.fn(),
      onBlur: jest.fn(),
      value: 'Brown Fox'
    };

    const tree = renderer.render(<SingleLineTextWidget {...props} />);
    expect(tree).toMatchSnapshot();
  });
});
