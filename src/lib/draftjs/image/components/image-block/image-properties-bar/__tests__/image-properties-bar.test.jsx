import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import ImagePropertiesBar from '../image-properties-bar';

const renderer = new ReactShallowRenderer();

// DropImagePreview renders ImagePropertiesBar with no function, make sure it doesn't error out
test('render empty alignment - no edit function', () => {
  const props = {
    onEdit: null,
    title: '',
    alignment: '',
    size: ''
  };

  const tree = renderer.render(<ImagePropertiesBar {...props} />);
  expect(tree).toMatchSnapshot();
});

test('render empty alignment - with edit function', () => {
  const props = {
    onEdit: jest.fn(),
    title: '',
    alignment: '',
    size: ''
  };

  const tree = renderer.render(<ImagePropertiesBar {...props} />);
  expect(tree).toMatchSnapshot();
});

test('render title', () => {
  const props = {
    onEdit: jest.fn(),
    title: 'A Gorgeous Test Title!',
    alignment: '',
    size: ''
  };

  const tree = renderer.render(<ImagePropertiesBar {...props} />);
  expect(tree).toMatchSnapshot();
});

test('render alignment, no size', () => {
  const props = {
    onEdit: jest.fn(),
    title: 'A Gorgeous Test Title!',
    alignment: 'center',
    size: ''
  };

  const tree = renderer.render(<ImagePropertiesBar {...props} />);
  expect(tree).toMatchSnapshot();
});

test('render size, no alignment', () => {
  const props = {
    onEdit: jest.fn(),
    title: 'A Gorgeous Test Title!',
    alignment: '',
    size: 'medium'
  };

  const tree = renderer.render(<ImagePropertiesBar {...props} />);
  expect(tree).toMatchSnapshot();
});

test('render full bar', () => {
  const props = {
    onEdit: jest.fn(),
    title: 'A Gorgeous Test Title!',
    alignment: 'center',
    size: 'medium'
  };

  const tree = renderer.render(<ImagePropertiesBar {...props} />);
  expect(tree).toMatchSnapshot();
});
