import React from 'react';
import TextInputWidget from '../text-input';
import ReactShallowRenderer from 'react-test-renderer/shallow';
const renderer = ReactShallowRenderer.createRenderer();

function getProps(props) {
  return {
    schema: {
      title: 'Test Title'
    },
    config: {
      // instructions: 'The quick brown fox jumps over the lazy dog. See [dogs](http://example.com/)'
    },
    onChange: jest.fn(),
    onBlur: jest.fn(),
    onFocus: jest.fn(),
    value: 'Brown Fox',
    path: 'test',
    ...props
  };
}

describe('TextInputWidget', () => {
  it('renders', () => {
    const props = getProps();

    const tree = renderer.render(<TextInputWidget {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders with instructions', () => {
    const props = getProps({
      config: {
        instructions: 'The quick brown fox jumps over the lazy dog. See [dogs](http://example.com/)'
      }
    });

    const tree = renderer.render(<TextInputWidget {...props} />);
    expect(tree).toMatchSnapshot();
  });
});
