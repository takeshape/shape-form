import React from 'react';
import AutocompleteWidget from '../autocomplete';
import {fromJS} from 'immutable';
import ReactShallowRenderer from 'react-test-renderer/shallow';
const renderer = ReactShallowRenderer.createRenderer();

const oneOf = {
  enum: ['a', 'b', 'c'],
  options: {
    D: 'd',
    E: 'e',
    F: 'f'
  }
};

describe('AutocompleteWidget', () => {
  it('renders with enum', () => {
    const props = {
      schema: fromJS({
        title: 'Test Title',
        enum: oneOf.enum
      }),
      config: fromJS({}),
      onChange: jest.fn(),
      onBlur: jest.fn(),
      value: 'a'
    };

    expect(renderer.render(<AutocompleteWidget {...props} />)).toMatchSnapshot();
  });

  it('renders with options', () => {
    const props = {
      schema: fromJS({
        title: 'Test Title'
      }),
      config: fromJS({
        options: oneOf.options
      }),
      onChange: jest.fn(),
      onBlur: jest.fn(),
      value: 'a'
    };

    expect(renderer.render(<AutocompleteWidget {...props} />)).toMatchSnapshot();
  });

  it('renders with options given both options and enum', () => {
    const props = {
      schema: fromJS({
        title: 'Test Title',
        enum: oneOf.enum
      }),
      config: fromJS({
        options: oneOf.options
      }),
      onChange: jest.fn(),
      onBlur: jest.fn(),
      value: 'a'
    };

    expect(renderer.render(<AutocompleteWidget {...props} />)).toMatchSnapshot();
  });

  it('renders with multiple values', () => {
    const props = {
      schema: fromJS({
        title: 'Test Title',
        type: 'array',
        enum: oneOf.enum
      }),
      config: fromJS({}),
      onChange: jest.fn(),
      onBlur: jest.fn(),
      value: ['a', 'b']
    };

    expect(renderer.render(<AutocompleteWidget {...props} />)).toMatchSnapshot();
  });

  it('renders with tooltip if has description', () => {
    const props = {
      schema: fromJS({
        title: 'Test Title',
        enum: oneOf.enum,
        description: 'sample description'
      }),
      config: fromJS({}),
      onChange: jest.fn(),
      onBlur: jest.fn(),
      value: 'a'
    };

    expect(renderer.render(<AutocompleteWidget {...props} />)).toMatchSnapshot();
  });

  it('calls onChange and onBlur when handling a change', () => {
    const props = {
      schema: fromJS({
        title: 'Test Title',
        type: 'array',
        enum: oneOf.enum
      }),
      config: fromJS({}),
      onChange: jest.fn(),
      onBlur: jest.fn(),
      value: ['a', 'b']
    };

    const acw = new AutocompleteWidget(props);
    acw.handleChange(['a', 'c']);

    expect(props.onChange).toHaveBeenCalledTimes(1);
    expect(props.onChange).toHaveBeenCalledWith(['a', 'c']);
    expect(props.onBlur).toHaveBeenCalledTimes(1);
  });
});
