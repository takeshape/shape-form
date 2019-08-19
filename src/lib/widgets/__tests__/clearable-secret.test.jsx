import React from 'react';
import {fromJS} from 'immutable';
import ClearableSecret from '../clearable-secret';
import ReactShallowRenderer from 'react-test-renderer/shallow';
const renderer = ReactShallowRenderer.createRenderer();

describe('ClearableSecret', () => {
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

    const tree = renderer.render(<ClearableSecret {...props} />);
    expect(tree).toMatchSnapshot();
  });
});
