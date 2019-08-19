import React from 'react';
import {fromJS} from 'immutable';
import DropdownWidget from '../dropdown';
import ReactShallowRenderer from 'react-test-renderer/shallow';
const renderer = ReactShallowRenderer.createRenderer();

const options = [
  {
    label: 'A',
    value: 'a'
  },
  {
    label: 'B',
    value: 'b'
  },
  {
    label: 'C',
    value: 'c'
  }
];

const oneOf = [
  {
    title: 'A',
    enum: ['a']
  },
  {
    title: 'B',
    enum: ['b']
  },
  {
    title: 'C',
    enum: ['c']
  }
];

describe('DropdownWidget', () => {
  it('renders', () => {
    const props = {
      schema: fromJS({
        title: 'Test Title',
        oneOf
      }),
      config: fromJS({}),
      onChange: jest.fn(),
      onBlur: jest.fn(),
      value: 'a'
    };

    const tree = renderer.render(<DropdownWidget {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders options', () => {
    const props = {
      schema: fromJS({
        title: 'Test Title'
      }),
      config: fromJS({options}),
      onChange: jest.fn(),
      onBlur: jest.fn(),
      value: 'a'
    };

    const tree = renderer.render(<DropdownWidget {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders with instructions', () => {
    const props = {
      schema: fromJS({
        title: 'Test Title'
      }),
      config: fromJS({
        instructions: 'The quick brown fox jumps over the lazy dog. See [dogs](http://example.com/)',
        options
      }),
      onChange: jest.fn(),
      onBlur: jest.fn(),
      value: 'Brown Fox'
    };

    const tree = renderer.render(<DropdownWidget {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders with description', () => {
    const props = {
      schema: fromJS({
        title: 'Test Title',
        description: 'The quick brown fox jumps over the lazy dog.'
      }),
      config: fromJS({options}),
      onChange: jest.fn(),
      onBlur: jest.fn(),
      value: 'Brown Fox'
    };

    const tree = renderer.render(<DropdownWidget {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders with enum options', () => {
    const props = {
      schema: fromJS({
        title: 'Title',
        description: 'some words',
        enum: ['Option 1', 'Option 2', 'Option 3']
      }),
      config: fromJS({options}),
      onChange: jest.fn(),
      onBlur: jest.fn(),
      value: 'Option 2'
    };

    expect(renderer.render(<DropdownWidget {...props} />)).toMatchSnapshot();
  });

  it('passes template function for itemTemplate', () => {
    function DropdownItem(props) {
      return <div>***{props.label}***</div>; // eslint-disable-line
    }

    const props = {
      schema: fromJS({
        title: 'Title',
        description: 'some words'
      }),
      config: fromJS({
        options,
        itemTemplate: 'customItem'
      }),
      widgets: {
        customItem: DropdownItem
      },
      onChange: jest.fn(),
      onBlur: jest.fn(),
      value: 'a'
    };

    expect(renderer.render(<DropdownWidget {...props} />)).toMatchSnapshot();
  });

  it('renders itemTemplate', () => {
    function DropdownItem(props) {
      return <div>***{props.label}***</div>; // eslint-disable-line
    }

    const props = {
      schema: fromJS({
        title: 'Title',
        description: 'some words'
      }),
      config: fromJS({
        options,
        itemTemplate: 'customItem'
      }),
      widgets: {
        customItem: DropdownItem
      },
      onChange: jest.fn(),
      onBlur: jest.fn(),
      value: 'a'
    };

    const component = new DropdownWidget(props);
    const itemComponent = component.renderItemTemplate(options[0]);
    const renderer = ReactShallowRenderer.createRenderer();
    expect(renderer.render(itemComponent)).toMatchSnapshot();
  });

  it('calls onChange and onBlur onChange', () => {
    const props = {
      schema: fromJS({
        title: 'Test Title',
        description: 'The quick brown fox jumps over the lazy dog.'
      }),
      config: fromJS({options}),
      onChange: jest.fn(),
      onBlur: jest.fn(),
      value: 'a'
    };

    const component = new DropdownWidget(props);
    component.handleChange('b');

    expect(props.onChange).toHaveBeenCalledTimes(1);
    expect(props.onChange).toHaveBeenCalledWith('b');
    expect(props.onBlur).toHaveBeenCalledTimes(1);
  });
});
