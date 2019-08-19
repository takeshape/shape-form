import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import ImageBlock from '../image-block';
import {convertFromRaw} from 'draft-js';
import singleImageState from './data/single-image-block.json';
import assetJson from './data/asset.json';
import {fromJS} from 'immutable';

const renderer = new ReactShallowRenderer();

const contentState = convertFromRaw(singleImageState);
const asset = fromJS(assetJson);

test('image block - no dragged item', () => {
  const props = {
    asset,
    loading: false,
    error: '',
    draggedItem: null,
    openAssetPicker: jest.fn(),
    connectDropTarget: jest.fn(x => x),
    getContent: jest.fn(),
    showFormDialog: jest.fn(),
    block: contentState.getFirstBlock(),
    blockProps: {
      onChange: jest.fn()
    },
    contentState
  };

  const tree = renderer.render(<ImageBlock {...props} />);
  expect(tree).toMatchSnapshot();
});

test('image block - with dragged item', () => {
  const props = {
    asset,
    loading: false,
    error: '',
    draggedItem: {},
    openAssetPicker: jest.fn(),
    connectDropTarget: jest.fn(x => x),
    getContent: jest.fn(),
    showFormDialog: jest.fn(),
    block: contentState.getFirstBlock(),
    blockProps: {
      onChange: jest.fn()
    },
    contentState
  };

  const tree = renderer.render(<ImageBlock {...props} />);
  expect(tree).toMatchSnapshot();
});

test('image block - no dragged item no asset', () => {
  const props = {
    asset: null,
    loading: false,
    error: '',
    draggedItem: null,
    openAssetPicker: jest.fn(),
    connectDropTarget: jest.fn(x => x),
    getContent: jest.fn(),
    showFormDialog: jest.fn(),
    block: contentState.getFirstBlock(),
    blockProps: {
      onChange: jest.fn()
    },
    contentState
  };

  const tree = renderer.render(<ImageBlock {...props} />);
  expect(tree).toMatchSnapshot();
});
