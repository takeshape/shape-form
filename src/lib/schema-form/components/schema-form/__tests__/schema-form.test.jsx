import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
const renderer = new ReactShallowRenderer();
import {shallow} from 'enzyme';
import {fromJS, Map} from 'immutable';
import SchemaForm from '../schema-form';

describe('SchemaForm', () => {
  it('renders', () => {
    const props = {
      formName: 'test-form',
      registerForm: jest.fn(),
      submitForm: jest.fn(),
      clearForm: jest.fn()
    };

    const tree = renderer.render(<SchemaForm {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders with schema', () => {
    const props = {
      formName: 'test-form',
      registerForm: jest.fn(),
      submitForm: jest.fn(),
      clearForm: jest.fn(),
      registeredSchema: fromJS({
        type: 'string'
      }),
      locale: 'pt-br'
    };

    const tree = renderer.render(<SchemaForm {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders with children', () => {
    const props = {
      formName: 'test-form',
      registerForm: jest.fn(),
      submitForm: jest.fn(),
      clearForm: jest.fn(),
      registeredSchema: fromJS({
        type: 'string'
      }),
      locale: 'pt-br'
    };

    const tree = renderer.render(
      <SchemaForm {...props}>
        <button>submit</button>
      </SchemaForm>
    );
    expect(tree).toMatchSnapshot();
  });

  function mockEvent() {
    return {
      preventDefault: jest.fn()
    };
  }

  it('handles submit', () => {
    const props = {
      formName: 'test-form',
      registerForm: jest.fn(),
      submitForm: jest.fn(),
      onSubmit: jest.fn(),
      clearForm: jest.fn(),
      registeredSchema: fromJS({
        type: 'string'
      })
    };

    const wrapper = shallow(
      <SchemaForm {...props}>
        <button>submit</button>
      </SchemaForm>
    );
    const event = mockEvent();
    wrapper.find('form').simulate('submit', event);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(props.submitForm).toHaveBeenCalledTimes(1);
    expect(props.submitForm).toHaveBeenCalledWith(props.formName, props.onSubmit);
  });

  it('calls registerForm on mount', () => {
    const props = {
      formName: 'test-form',
      registerForm: jest.fn(),
      submitForm: jest.fn(),
      onSubmit: jest.fn(),
      clearForm: jest.fn(),
      schema: fromJS({
        type: 'string'
      }),
      initialData: Map()
    };

    shallow(<SchemaForm {...props} />);

    expect(props.registerForm).toHaveBeenCalledTimes(1);
    expect(props.registerForm).toHaveBeenCalledWith(props.formName, props.schema, props.initialData);
  });

  it('calls clearForm on unmount', () => {
    const props = {
      formName: 'test-form',
      registerForm: jest.fn(),
      submitForm: jest.fn(),
      onSubmit: jest.fn(),
      clearForm: jest.fn(),
      schema: fromJS({
        type: 'string'
      }),
      initialData: Map()
    };

    const wrapper = shallow(<SchemaForm {...props} />);
    wrapper.unmount();

    expect(props.clearForm).toHaveBeenCalledTimes(1);
    expect(props.clearForm).toHaveBeenCalledWith(props.formName);
  });

  it('does not call clearForm on unmount when partial is true', () => {
    const props = {
      formName: 'test-form',
      registerForm: jest.fn(),
      submitForm: jest.fn(),
      onSubmit: jest.fn(),
      clearForm: jest.fn(),
      partial: true
    };

    const wrapper = shallow(<SchemaForm {...props} />);
    wrapper.unmount();

    expect(props.clearForm).toHaveBeenCalledTimes(0);
  });

  it('calls registerForm when props update', () => {
    const props = {
      formName: 'test-form',
      registerForm: jest.fn(),
      submitForm: jest.fn(),
      onSubmit: jest.fn(),
      clearForm: jest.fn(),
      schema: fromJS({
        type: 'object',
        properties: {
          name: {type: 'string'}
        }
      }),
      initialData: Map(),
      version: 1
    };

    const wrapper = shallow(<SchemaForm {...props} />);
    expect(props.registerForm).toHaveBeenCalledTimes(1);

    const newData = Map({name: 'Samy Pessé'});
    wrapper.setProps({version: 2, initialData: newData});
    expect(props.registerForm).toHaveBeenCalledTimes(2);
    expect(props.registerForm).toHaveBeenLastCalledWith(props.formName, props.schema, newData);

    const newSchema = fromJS({
      type: 'object',
      properties: {
        name: {type: 'string'},
        address: {type: 'string'}
      }
    });
    wrapper.setProps({version: 3, initialData: undefined, schema: newSchema});
    expect(props.registerForm).toHaveBeenCalledTimes(3);
    expect(props.registerForm).toHaveBeenLastCalledWith(props.formName, newSchema, undefined);
  });
  it('calls registerForm when schema changes', () => {
    const props = {
      formName: 'test-form',
      registerForm: jest.fn(),
      submitForm: jest.fn(),
      onSubmit: jest.fn(),
      clearForm: jest.fn(),
      context: {contentId: 'oldContentId'},
      schema: fromJS({
        type: 'object',
        properties: {
          name: {type: 'string'}
        }
      }),
      initialData: Map(),
      version: 1
    };

    const wrapper = shallow(<SchemaForm {...props} />);
    expect(props.registerForm).toHaveBeenCalledTimes(1);

    const newSchema = fromJS({
      type: 'object',
      properties: {
        title: {type: 'string'}
      }
    });

    wrapper.setProps({schema: newSchema});
    expect(props.registerForm).toHaveBeenCalledTimes(2);
    expect(props.registerForm).toHaveBeenLastCalledWith(props.formName, newSchema, props.initialData);
  });
});
