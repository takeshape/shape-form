import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import PasswordWidget from '../password';
import {fromJS} from 'immutable';

const renderer = new ShallowRenderer();
const render = renderer.render.bind(renderer);

describe('PasswordWidget', () => {
  const basicProps = {
    value: 'password',
    schema: fromJS({
      maxLength: 8,
      title: 'Password'
    }),
    config: fromJS({
      instructions: 'instr'
    }),
    onChange: jest.fn(),
    onBlur: jest.fn()
  };

  it('renders', () => {
    expect(render(<PasswordWidget {...basicProps} />)).toMatchSnapshot();
  });

  it('renders when disabled', () => {
    expect(render(<PasswordWidget {...basicProps} disabled />)).toMatchSnapshot();
  });
});
