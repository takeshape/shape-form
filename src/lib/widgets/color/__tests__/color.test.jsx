import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import ColorWidget from '../color';
import {fromJS} from 'immutable';
import _omit from 'lodash/omit';

const renderer = new ShallowRenderer();
const render = renderer.render.bind(renderer);

describe('ColorWidget', () => {
  const basicProps = {
    value: fromJS({
      rgb: {
        val: 'some color'
      }
    }),
    schema: {},
    onChange: jest.fn(),
    onBlur: jest.fn()
  };

  it('renders', () => {
    expect(render(<ColorWidget {...basicProps} />)).toMatchSnapshot();
  });

  it('renders when disabled', () => {
    expect(render(<ColorWidget {...basicProps} disabled />)).toMatchSnapshot();
  });

  it('handleChange', () => {
    const color = {
      hsl: 'hsl',
      hex: 'hex',
      rgb: 'rgb',
      hsv: 'hsv',
      anotherOne: 'anotherOne'
    };
    const onChange = jest.fn();
    const colorWidget = new ColorWidget({...basicProps, onChange});
    colorWidget.handleChange(color);

    expect(onChange).toHaveBeenCalledWith(_omit(color, 'anotherOne'));
  });

  it('handleResetColor', () => {
    const onChange = jest.fn();
    const colorWidget = new ColorWidget({...basicProps, onChange});
    colorWidget.handleResetColor();

    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('toggleColorPicker', () => {
    const colorWidget = new ColorWidget(basicProps);
    colorWidget.state.isColorPickerVisible = false;
    const setState = (colorWidget.setState = jest.fn());
    colorWidget.toggleColorPicker();
    expect(setState).toHaveBeenCalledWith({isColorPickerVisible: true});
    colorWidget.state.isColorPickerVisible = true;
    colorWidget.toggleColorPicker();
    expect(setState).toHaveBeenCalledWith({isColorPickerVisible: false});
  });

  it('toggleColorPicker when disabled', () => {
    const colorWidget = new ColorWidget({...basicProps, disabled: true});
    const setState = (colorWidget.setState = jest.fn());
    colorWidget.toggleColorPicker();
    expect(setState).toHaveBeenCalledTimes(0);
  });
});
