import React from 'react';
import NumberWidget from '../number';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import {fromJS} from 'immutable';

const renderer = new ReactShallowRenderer();

describe('NumberWidget', () => {
  it('renders', () => {
    const props = {
      value: 666,
      schema: fromJS({
        multipleOf: 2,
        minimum: 3,
        maximum: 4,
        description: 'desc'
      }),
      config: fromJS({
        instructions: 'instr'
      }),
      onChange: jest.fn(),
      onBlur: jest.fn()
    };

    expect(renderer.render(<NumberWidget {...props} />)).toMatchSnapshot();
  });
});
