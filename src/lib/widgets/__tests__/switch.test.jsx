import React from 'react';
import SwitchWidget from '../switch';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import {fromJS} from 'immutable';

const renderer = new ReactShallowRenderer();

function getProps(options) {
  return {
    value: true,
    schema: fromJS({
      type: 'boolean',
      description: 'desc'
    }),
    config: fromJS({
      instructions: 'instr'
    }),
    onChange: jest.fn(),
    onBlur: jest.fn(),
    ...options
  };
}

describe('SwitchWidget', () => {
  it('renders', () => {
    const props = getProps();

    expect(renderer.render(<SwitchWidget {...props} />)).toMatchSnapshot();
  });

  it('renders default', () => {
    const props = getProps({
      value: '',
      schema: fromJS({
        type: 'boolean',
        default: false
      })
    });

    expect(renderer.render(<SwitchWidget {...props} />)).toMatchSnapshot();
  });

  it('calls onChange and onBlur onChange', () => {
    const props = getProps();

    const component = new SwitchWidget(props);
    component.handleChange('b');

    expect(props.onChange).toHaveBeenCalledTimes(1);
    expect(props.onChange).toHaveBeenCalledWith('b');
    expect(props.onBlur).toHaveBeenCalledTimes(1);
  });
});
