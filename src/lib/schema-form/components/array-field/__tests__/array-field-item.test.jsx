jest.mock('../../../decorators/sortable-item', () => x => x);
jest.mock('../../schema-field', () => 'SchemaField');
jest.mock('../../content-preview', () => 'ContentPreview');
jest.mock('react-toolbox/lib/card', () => ({
  Card: 'Card',
  CardText: 'CardText'
}));
jest.mock('react-toolbox/lib/button', () => ({
  Button: 'Button',
  IconButton: 'IconButton'
}));

import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
const renderer = new ReactShallowRenderer();
import {shallow, mount} from 'enzyme';
import {Map} from 'immutable';
import ArrayFieldItem from '../array-field-item';

const schema = Map({
  type: 'object',
  properties: Map({
    email: {type: 'string'},
    firstName: {type: 'string'},
    lastName: {type: 'string'}
  })
});

function createProps(props) {
  const passthrough = x => x;
  return {
    formName: 'test-form',
    schema,
    path: 'users',
    config: Map(),
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
    ...props
  };
}
const consoleError = console.error;

function silentMount(component) {
  console.error = () => {};
  const result = mount(component);
  console.error = consoleError;
  return result;
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
      config: Map({wrapper: 'unstyled'}),
      widgets: {unstyled: Unstyled}
    });
    const tree = renderer.render(<ArrayFieldItem {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('sets domNode for use in the sortableItem decorator', () => {
    const props = createProps({isCollapsed: true});

    const wrapper = silentMount(<ArrayFieldItem {...props} />);

    expect(wrapper.instance().domNode).toBeTruthy();
  });

  function mockEvent() {
    return {
      preventDefault: jest.fn()
    };
  }

  it('handleToggle', () => {
    const props = createProps();

    const wrapper = shallow(<ArrayFieldItem {...props} />);
    const event = mockEvent();
    wrapper
      .find('IconButton')
      .at(0)
      .simulate('click', event);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(props.toggleItem).toHaveBeenCalledTimes(1);
    expect(props.toggleItem).toHaveBeenCalledWith(props.arrayKey);
  });

  it('handleRemove', () => {
    const props = createProps();

    const wrapper = shallow(<ArrayFieldItem {...props} />);
    const event = mockEvent();
    wrapper
      .find('IconButton')
      .at(1)
      .simulate('click', event);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(props.removeItem).toHaveBeenCalledTimes(1);
    expect(props.removeItem).toHaveBeenCalledWith(props.index);
    expect(props.onBlur).toHaveBeenCalledTimes(1);
  });
});
