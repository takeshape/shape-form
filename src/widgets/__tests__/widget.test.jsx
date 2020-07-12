import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import Widget from '../widget';

const renderer = ReactShallowRenderer.createRenderer();

function createProps(props) {
  return {
    schema: {
      title: 'Test Title'
    },
    onChange: jest.fn(),
    onBlur: jest.fn(),
    value: 'Brown Fox',
    ...props
  };
}

describe('Widget', () => {
  it('renders', () => {
    const props = createProps();

    const tree = renderer.render(<Widget {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders when disabled', () => {
    const props = createProps({
      disabled: true
    });

    const tree = renderer.render(<Widget {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders with instructions', () => {
    const props = createProps({
      config: {
        instructions: 'The quick brown fox jumps over the lazy dog. See [dogs](http://example.com/)'
      }
    });

    const tree = renderer.render(<Widget {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders when required', () => {
    const props = createProps({
      isRequired: true
    });

    const tree = renderer.render(<Widget {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders with description', () => {
    const props = createProps({
      schema: {
        title: 'Test Title',
        description: 'The quick brown fox jumps over the lazy dog.'
      }
    });

    const tree = renderer.render(<Widget {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders with error', () => {
    const props = createProps({
      error: 'Invalid format'
    });

    const tree = renderer.render(<Widget {...props} />);
    expect(tree).toMatchSnapshot();
  });
});
