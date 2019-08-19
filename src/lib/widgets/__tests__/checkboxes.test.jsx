import React from 'react';
import CheckboxesWidget from '../checkboxes';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import {fromJS} from 'immutable';

const renderer = new ReactShallowRenderer();

describe('CheckboxesWidget', () => {
  it('renders', () => {
    const props = {
      value: '',
      schema: fromJS({
        title: '',
        description: 'desc'
      }),
      config: fromJS({
        instructions: 'instr'
      }),
      options: [
        {
          label: '',
          value: false
        }
      ],
      onChange: jest.fn(),
      onBlur: jest.fn()
    };

    expect(renderer.render(<CheckboxesWidget {...props} />)).toMatchSnapshot();
  });
});
