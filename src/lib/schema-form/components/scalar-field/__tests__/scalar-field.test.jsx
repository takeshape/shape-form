import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
const renderer = new ReactShallowRenderer();
import {Map} from 'immutable';
import ScalarField from '../scalar-field';

describe('ScalarField', () => {
  it('renders', () => {
    const props = {
      value: 'Andrew',
      schema: Map({type: 'string', title: 'Name'}),
      formName: 'test-form',
      path: 'name',
      config: Map(),
      ui: Map(),
      locale: 'pt-br',

      onChange: jest.fn(),
      onChangeSilent: jest.fn(),
      onBlur: jest.fn(),
      onFocus: jest.fn(),
      setUI: jest.fn()
    };

    const tree = renderer.render(<ScalarField {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders custom widget', () => {
    const props = {
      value: 'Andrew',
      schema: Map({type: 'string', title: 'Name'}),
      formName: 'test-form',
      path: 'name',
      config: Map({widget: 'Custom'}),
      ui: Map(),
      widgets: {
        Custom({value}) { // eslint-disable-line
          return <div>{value}</div>;
        }
      },
      locale: 'pt-br',

      onChange: jest.fn(),
      onChangeSilent: jest.fn(),
      onBlur: jest.fn(),
      onFocus: jest.fn(),
      setUI: jest.fn()
    };

    const tree = renderer.render(<ScalarField {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('falls back on DefaultWidget if the configured widget is undefined', () => {
    const props = {
      value: 'Andrew',
      schema: Map({type: 'string', title: 'Name'}),
      formName: 'test-form',
      path: 'name',
      config: Map({widget: 'custom'}),
      ui: Map(),
      widgets: {},
      locale: 'pt-br',

      onChange: jest.fn(),
      onChangeSilent: jest.fn(),
      onBlur: jest.fn(),
      onFocus: jest.fn(),
      setUI: jest.fn()
    };

    const tree = renderer.render(<ScalarField {...props} />);
    expect(tree).toMatchSnapshot();
  });
});
