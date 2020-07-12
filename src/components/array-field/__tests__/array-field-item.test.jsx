jest.mock('../../schema-field', () => 'SchemaField');
jest.mock('../../content-preview', () => 'ContentPreview');

import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import {shallow} from 'enzyme';
import {ArrayFieldItem} from '../array-field-item';

const renderer = new ReactShallowRenderer();

const schema = {
  type: 'object',
  properties: {
    email: {type: 'string'},
    firstName: {type: 'string'},
    lastName: {type: 'string'}
  }
};

function createProps(props) {
  const passthrough = x => x;
  return {
    formName: 'test-form',
    schema,
    path: 'users',
    config: {},
    context: {foo: 'bar'},
    widgets: {},

    // Array related:
    index: 0,
    arrayKey: 0,
    isCollapsed: false,
    removeItem: jest.fn(),
    toggleItem: jest.fn(),
    fieldAction: jest.fn(),
    isDragging: false,
    connectDragSource: passthrough,
    connectDropTarget: passthrough,
    connectDragPreview: passthrough,
    onBlur: jest.fn(),
    locale: 'pt-br',
    classes: {expanded: 'expanded', details: 'details'},
    ...props
  };
}

function mockEvent() {
  return {
    preventDefault: jest.fn()
  };
}

describe('ArrayFieldItem', () => {
  it('renders', () => {
    const props = createProps();
    const tree = renderer.render(<ArrayFieldItem {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders when disabled', () => {
    const props = createProps();
    const tree = renderer.render(<ArrayFieldItem {...props} disabled />);
    expect(tree).toMatchSnapshot();
  });

  it('renders when collapsed', () => {
    const props = createProps({isCollapsed: true});
    props.isCollapsed = true;
    const tree = renderer.render(<ArrayFieldItem {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders with custom wrapper', () => {
    const Unstyled = ({children}) => <div>{children}</div>; // eslint-disable-line
    const props = createProps({
      config: {wrapper: 'unstyled'},
      widgets: {unstyled: Unstyled}
    });
    const tree = renderer.render(<ArrayFieldItem {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('handleToggle', () => {
    const props = createProps();

    const wrapper = shallow(<ArrayFieldItem {...props} />);
    const event = mockEvent();
    wrapper
      .find(ExpansionPanel)
      .at(0)
      .simulate('change', event);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(props.toggleItem).toHaveBeenCalledTimes(1);
    expect(props.toggleItem).toHaveBeenCalledWith(props.arrayKey);
  });

  it('handleRemove', () => {
    const props = createProps();

    const wrapper = shallow(<ArrayFieldItem {...props} />);
    const event = mockEvent();
    wrapper
      .find(Button)
      .at(0)
      .simulate('click', event);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(props.removeItem).toHaveBeenCalledTimes(1);
    expect(props.removeItem).toHaveBeenCalledWith(props.index);
    expect(props.onBlur).toHaveBeenCalledTimes(1);
  });
});
