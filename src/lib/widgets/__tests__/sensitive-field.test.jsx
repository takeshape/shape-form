import React from 'react';
import {fromJS} from 'immutable';
import SensitiveFieldWidget from '../sensitive-field';
import ReactShallowRenderer from 'react-test-renderer/shallow';
const renderer = ReactShallowRenderer.createRenderer();

describe('SensitiveFieldWidget', () => {
  it('renders', () => {
    const props = {
      schema: fromJS({
        title: 'Sensitive Field Test Title'
      }),
      context: {
        isNew: true
      },
      config: fromJS({}),
      onChange: jest.fn(),
      onBlur: jest.fn(),
      value: 'SECRET TEXT'
    };

    const tree = renderer.render(<SensitiveFieldWidget {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders with maxLength', () => {
    const props = {
      schema: fromJS({
        title: 'Sensitive Field Test Title',
        maxLength: 30
      }),
      context: {
        isNew: true
      },
      config: fromJS({}),
      onChange: jest.fn(),
      onBlur: jest.fn(),
      value: 'SECRET TEXT'
    };

    const tree = renderer.render(<SensitiveFieldWidget {...props} />);
    expect(tree).toMatchSnapshot();
  });
});
