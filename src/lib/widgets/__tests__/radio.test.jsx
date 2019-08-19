import React from 'react';
import RadioWidget from '../radio';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import {fromJS} from 'immutable';

const renderer = new ReactShallowRenderer();

function getProps(options) {
  return {
    value: true,
    schema: fromJS({
      description: 'desc'
    }),
    config: fromJS({
      instructions: 'instr',
      options: [
        {
          label: 'option1',
          value: true
        },
        {
          label: 'option2',
          value: false
        }
      ]
    }),
    onChange: jest.fn(),
    onBlur: jest.fn(),
    ...options
  };
}

describe('RadioWidget', () => {
  it('renders', () => {
    const props = getProps();

    expect(renderer.render(<RadioWidget {...props} />)).toMatchSnapshot();
  });

  it('calls onChange and onBlur onChange', () => {
    const props = getProps();

    const component = new RadioWidget(props);
    component.handleChange('b');

    expect(props.onChange).toHaveBeenCalledTimes(1);
    expect(props.onChange).toHaveBeenCalledWith('b');
    expect(props.onBlur).toHaveBeenCalledTimes(1);
  });
});
