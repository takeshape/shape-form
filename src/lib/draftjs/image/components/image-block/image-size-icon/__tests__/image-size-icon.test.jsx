import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import ImageSizeIcon from '../image-size-icon';

const renderer = new ReactShallowRenderer();

test('render no size icon', () => {
  const props = {
    size: ''
  };

  const tree = renderer.render(<ImageSizeIcon {...props} />);
  expect(tree).toMatchSnapshot();
});

test('render small size icon', () => {
  const props = {
    size: 'small'
  };

  const tree = renderer.render(<ImageSizeIcon {...props} />);
  expect(tree).toMatchSnapshot();
});

test('render medium size icon', () => {
  const props = {
    size: 'medium'
  };

  const tree = renderer.render(<ImageSizeIcon {...props} />);
  expect(tree).toMatchSnapshot();
});

test('render large size icon', () => {
  const props = {
    size: 'large'
  };

  const tree = renderer.render(<ImageSizeIcon {...props} />);
  expect(tree).toMatchSnapshot();
});
