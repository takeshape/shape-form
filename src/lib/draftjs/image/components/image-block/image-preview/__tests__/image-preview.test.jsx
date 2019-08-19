import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

import ImagePreview from '../image-preview';

const renderer = new ReactShallowRenderer();

test('image preview - placeholder', () => {
  const props = {
    path: null,
    onClick: jest.fn(),
    isDraggedOn: false
  };

  const tree = renderer.render(<ImagePreview {...props} />);
  expect(tree).toMatchSnapshot();
});

test('image preview - not dragged on', () => {
  const props = {
    path: 'totallyRealPath',
    onClick: jest.fn(),
    isDraggedOn: false
  };

  const tree = renderer.render(<ImagePreview {...props} />);
  expect(tree).toMatchSnapshot();
});

test('image preview - dragged on', () => {
  const props = {
    path: 'totallyRealPath',
    onClick: jest.fn(),
    isDraggedOn: true
  };

  const tree = renderer.render(<ImagePreview {...props} />);
  expect(tree).toMatchSnapshot();
});

it('handleImageLoading', () => {
  const props = {
    path: 'totallyRealPath',
    onClick: jest.fn()
  };

  const mockImg = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  };

  const wrapper = shallow(<ImagePreview {...props} />);
  const imagePreview = wrapper.instance();

  // mount image
  imagePreview.handleImageLoading(mockImg);
  expect(toJson(wrapper.shallow())).toMatchSnapshot('loading');
  expect(mockImg.addEventListener).toHaveBeenCalledWith('load', imagePreview.doneLoading);

  // image finishes loading
  imagePreview.doneLoading();
  expect(toJson(wrapper.shallow())).toMatchSnapshot('loaded');

  // unmount image
  imagePreview.handleImageLoading(null);
  expect(mockImg.removeEventListener).toHaveBeenCalledWith('load', imagePreview.doneLoading);
});
