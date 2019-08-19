import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import DropImagePreview from '../drop-image-preview';

const renderer = new ReactShallowRenderer();

test('DropImagePreview renders correctly', () => {
  const tree = renderer.render(<DropImagePreview path="test" />);
  expect(tree).toMatchSnapshot();
});
