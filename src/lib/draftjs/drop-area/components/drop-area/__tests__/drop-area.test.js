jest.mock('../../drop-image-preview/drop-image-preview', () => 'DropImagePreview');
jest.mock('app/asset-uploader/components/upload-status', () => 'UploadStatus');

jest.mock('draft-js', () => {
  return {
    EditorBlock: 'EditorBlock'
  };
});

const mockConnectDropTarget = result => result;

import React from 'react';
import renderer from 'react-test-renderer';
import DropArea from '../drop-area';

test('Renders Editor Block when no draggedItem', () => {
  const tree = renderer.create(<DropArea connectDropTarget={mockConnectDropTarget} />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('Renders Image Preview when draggedItem and canHover', () => {
  const tree = renderer
    .create(<DropArea canHover draggedItem={{path: 'test'}} connectDropTarget={mockConnectDropTarget} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test('Renders Upload Status when uploading', () => {
  const component = renderer.create(<DropArea connectDropTarget={mockConnectDropTarget} />);

  component.getInstance().setState({uploading: true});
  const tree = component.toJSON();

  expect(tree).toMatchSnapshot();
});
