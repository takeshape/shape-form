import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
const renderer = new ReactShallowRenderer();

import {shallow} from 'enzyme';
import {fromJS} from 'immutable';
import DefaultWidget from '../default-widget';

function getProps(props) {
  return {
    value: 'Hello World',
    isRequired: false,
    error: '',
    config: fromJS({}),
    path: 'test',
    schema: fromJS({type: 'string', title: 'Text Input'}),
    onChange: jest.fn(),
    onBlur: jest.fn(),
    onFocus: jest.fn(),
    ...props
  };
}

describe('DefaultWidget', () => {
  it('renders text input', () => {
    const props = getProps();

    const tree = renderer.render(<DefaultWidget {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders dropdown', () => {
    const props = getProps({
      value: 'foo',
      schema: fromJS({type: 'string', title: 'Text Input', enum: ['foo', 'bar', 'baz']})
    });

    const tree = renderer.render(<DefaultWidget {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders checkbox', () => {
    const props = getProps({
      value: true,
      schema: fromJS({type: 'boolean', title: 'Checkbox Input'})
    });

    const tree = renderer.render(<DefaultWidget {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders number input', () => {
    const props = getProps({
      value: true,
      schema: fromJS({type: 'number', title: 'Number Input'})
    });

    const tree = renderer.render(<DefaultWidget {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('handles onChange number', done => {
    console.warn = jest.fn();
    const eventValue = '1';
    const expected = 1;

    const props = getProps({
      value: true,
      schema: fromJS({type: 'number', title: 'Number Input'}),
      onChange(value) {
        expect(value).toBe(expected);
        done();
      }
    });

    const wrapper = shallow(<DefaultWidget {...props} />);
    wrapper.instance().handleChange(eventValue);
  });

  it('handles onChange number blank', done => {
    console.warn = jest.fn();
    const eventValue = '';
    const expected = undefined;

    const props = getProps({
      value: true,
      schema: fromJS({type: 'number', title: 'Number Input'}),
      onChange(value) {
        expect(value).toBe(expected);
        done();
      }
    });

    const wrapper = shallow(<DefaultWidget {...props} />);
    wrapper.instance().handleChange(eventValue);
  });

  it('handles onChange string', done => {
    const eventValue = 'hello';

    const props = getProps({
      value: true,
      schema: fromJS({type: 'string', title: 'Text Input'}),
      onChange(value) {
        expect(value).toBe(eventValue);
        done();
      }
    });

    const wrapper = shallow(<DefaultWidget {...props} />);
    wrapper.instance().handleChange(eventValue);
  });
});
