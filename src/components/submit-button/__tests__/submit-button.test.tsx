import React from 'react';
import Button from '@material-ui/core/Button';
import {shallow} from 'enzyme';
import * as ShallowRenderer from 'react-test-renderer/shallow';
import SubmitButton, {SubmitProps} from '../submit-button';

const getProps = (props?: Partial<SubmitProps>): SubmitProps => ({
  formName: 'form',
  hasError: false,
  isDirty: false,
  submitForm: jest.fn((formName: string, callback?: () => void) => {
    if (callback) return callback();
    return jest.fn();
  }),
  onSubmit: undefined,
  ...props
});

describe('Submit Button', () => {
  it('renders without exploding', () => {
    const props = getProps();
    const renderer = ShallowRenderer.createRenderer();
    const tree = renderer.render(<SubmitButton {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders while saving', () => {
    const props = getProps({
      saving: true
    });
    const renderer = ShallowRenderer.createRenderer();
    const tree = renderer.render(<SubmitButton {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('handles submitting with no callback', () => {
    const props = getProps();
    const wrapper = shallow(<SubmitButton {...props} />);

    wrapper
      .find(Button)
      .at(0)
      .simulate('click');
    expect(props.submitForm).toHaveBeenCalledTimes(1);
  });

  it('handles submitting with a callback', () => {
    const props = getProps({
      onSubmit: jest.fn()
    });
    const wrapper = shallow(<SubmitButton {...props} />);

    wrapper
      .find(Button)
      .at(0)
      .simulate('click');
    expect(props.onSubmit).toHaveBeenCalledTimes(1);
  });
});
