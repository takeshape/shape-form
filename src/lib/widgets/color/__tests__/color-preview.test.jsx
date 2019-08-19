import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import ColorPreview from '../color-preview';

const renderer = new ShallowRenderer();
const render = renderer.render.bind(renderer);

describe('ColorPreview', () => {
  const basicProps = {
    color: {r: 255, g: 255, b: 255, a: 1},
    toggleColorPicker: jest.fn()
  };

  it('renders', () => {
    expect(render(<ColorPreview {...basicProps} />)).toMatchSnapshot();
  });

  it('renders when disabled', () => {
    expect(render(<ColorPreview {...basicProps} disabled />)).toMatchSnapshot();
  });

  it('renders with default color', () => {
    expect(render(<ColorPreview {...basicProps} color={undefined} />)).toMatchSnapshot();
  });
});
