import React from 'react';
import CheckboxWidget from '../checkbox';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import {fromJS} from 'immutable';

const renderer = new ReactShallowRenderer();

describe('CheckboxWidget', () => {
  it('renders', () => {
    const props = {
      value: true,
      schema: fromJS({
        description: 'desc'
      }),
      config: fromJS({
        instructions: 'instr'
      }),
      onChange: jest.fn(),
      onBlur: jest.fn()
    };

    expect(renderer.render(<CheckboxWidget {...props} />)).toMatchSnapshot();
  });
});
