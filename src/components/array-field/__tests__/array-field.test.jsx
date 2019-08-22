jest.mock('../../schema-field', () => 'SchemaField');
import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';

const renderer = new ReactShallowRenderer();
import {shallow} from 'enzyme';
import {Map, Set, List, fromJS} from 'immutable';
import ArrayField from '../array-field';
import Fab from '@material-ui/core/Fab';

const formName = 'test-form';
const schema = fromJS({
  type: 'array',
  items: {
    type: 'object',
    properties: {
      email: {type: 'string'},
      firstName: {type: 'string'},
      lastName: {type: 'string'}
    }
  }
});

const ui = fromJS({
  arrayKeys: List.of(0, 1, 2),
  collapsed: Set()
});

function createProps(props) {
  return {
    schema,
    formName,
    ui,
    path: 'users',
    config: Map(),
    context: {},
    widgets: {},
    isRequired: false,

    length: 3,
    fieldAction: jest.fn(),
    addArrayItem: jest.fn(),
    removeArrayItem: jest.fn(),
    toggleArrayItem: jest.fn(),
    expandAllArrayItems: jest.fn(),
    collapseAllArrayItems: jest.fn(),
    initializeArray: jest.fn(),
    blurField: jest.fn(),
    locale: 'pt-br',
    ...props
  };
}

function mockEvent() {
  return {
    preventDefault: jest.fn()
  };
}

describe('ArrayField', () => {
  it('renders', () => {
    const props = createProps();
    const tree = renderer.render(<ArrayField {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders when disabled', () => {
    const props = createProps();
    const tree = renderer.render(<ArrayField {...props} disabled />);
    expect(tree).toMatchSnapshot();
  });

  it('renders empty', () => {
    const props = createProps({
      length: 0
    });

    const tree = renderer.render(<ArrayField {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders single', () => {
    const props = createProps({
      schema: schema.merge({minItems: 1, maxItems: 1}),
      ui: ui.merge({arrayKeys: List.of(0), collapsed: Set()}),
      path: 'user',
      length: 1
    });

    const tree = renderer.render(<ArrayField {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders placeholder', () => {
    const props = createProps({
      ui: ui.merge({placeholder: Map({index: 1})})
    });

    const tree = renderer.render(<ArrayField {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders with dragAndDrop', () => {
    const props = createProps({
      ui: ui.merge({placeholder: Map({index: 1})}),
      config: Map({dragAndDrop: true})
    });

    const tree = renderer.render(<ArrayField {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders with a custom wrapper', () => {
    const Unstyled = ({children}) => <div>{children}</div>;// eslint-disable-line
    const props = createProps({
      widgets: {unstyled: Unstyled},
      config: Map({wrapper: 'unstyled'})
    });

    const tree = renderer.render(<ArrayField {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('calls initializeArray on mount', () => {
    const props = createProps();

    shallow(<ArrayField {...props} />);
    expect(props.initializeArray).toHaveBeenCalledTimes(1);
    expect(props.initializeArray).toHaveBeenCalledWith(props.formName, props.path);
  });

  it('calls initializeArray on update when the path changes', () => {
    const props = createProps();

    const wrapper = shallow(<ArrayField {...props} />);
    expect(props.initializeArray).toHaveBeenCalledTimes(1);
    expect(props.initializeArray).toHaveBeenLastCalledWith(props.formName, props.path);

    wrapper.setProps({error: 'OH NO'});
    expect(props.initializeArray).toHaveBeenCalledTimes(1);

    wrapper.setProps({path: 'new'});
    expect(props.initializeArray).toHaveBeenCalledTimes(2);
    expect(props.initializeArray).toHaveBeenLastCalledWith(props.formName, 'new');
  });

  it('handleAddItem', () => {
    const props = createProps();

    const wrapper = shallow(<ArrayField {...props} />);
    const event = mockEvent();

    wrapper.find(Fab).simulate('click', event);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(props.addArrayItem).toHaveBeenCalledTimes(1);
    expect(props.addArrayItem).toHaveBeenCalledWith({});
    expect(props.blurField).toHaveBeenCalledTimes(1);
  });

  it('handleAddItem with default value', () => {
    const defaultValue = Map({
      email: 'samy@baguette.fr',
      firstName: 'Samy',
      lastName: 'Pessé'
    });
    const props = createProps();
    props.schema = props.schema.setIn(['items', 'default'], defaultValue);

    const wrapper = shallow(<ArrayField {...props} />);
    const event = mockEvent();
    wrapper.find(Fab).simulate('click', event);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(props.addArrayItem).toHaveBeenCalledTimes(1);
    expect(props.addArrayItem).toHaveBeenCalledWith(defaultValue);
    expect(props.blurField).toHaveBeenCalledTimes(1);
  });
});
