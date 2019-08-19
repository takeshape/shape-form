import React from 'react';
import MarkdownTextWidget from '../index';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import {fromJS} from 'immutable';
import {shallow} from 'enzyme';

const renderer = new ReactShallowRenderer();

function getProps() {
  return {
    value: '',
    schema: fromJS({
      title: 'hello',
      description: 'desc'
    }),
    config: fromJS({
      instructions: 'instr'
    }),
    onChange: jest.fn(),
    onBlur: jest.fn()
  };
}

describe('MarkdownTextWidget', () => {
  it('renders', () => {
    const props = getProps();

    expect(renderer.render(<MarkdownTextWidget {...props} />)).toMatchSnapshot();
  });

  it('handleTabChange', () => {
    const props = getProps();

    const wrapper = shallow(<MarkdownTextWidget {...props} />);

    expect(wrapper.instance().state.index).toBe(0);
    wrapper.instance().handleTabChange(1);
    expect(wrapper.instance().state.index).toBe(1);
  });
});
