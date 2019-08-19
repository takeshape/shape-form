import {insertCustomAtomicBlock} from '../custom-atomic-block';
import {EditorState} from 'draft-js';

import getSampleStateForTesting from './sample-state';

const {editorState, contentState, selectionState} = getSampleStateForTesting();
const originalFirstBlock = contentState.getBlockMap().first();

const blockType = 'custom-block';
function assertAtomicBlock(block) {
  expect(block.getType()).toBe(blockType);
  expect(block.getText()).toBe(' ');
}

test('Collapsed cursor - must insert atomic at start of block', () => {
  const resultEditor = insertCustomAtomicBlock(editorState, blockType);
  const resultContent = resultEditor.getCurrentContent();

  // Empty block inserted above content.
  const firstBlock = resultContent.getBlockMap().first();
  expect(firstBlock.getType()).toBe('unstyled');
  expect(firstBlock.getText()).toBe('');

  const secondBlock = resultContent
    .getBlockMap()
    .skip(1)
    .first();
  assertAtomicBlock(secondBlock);

  const thirdBlock = resultContent
    .getBlockMap()
    .skip(2)
    .first();
  expect(thirdBlock.getText()).toBe(originalFirstBlock.getText());
});

test('Collapsed cursor - must insert atomic within a block, via split', () => {
  const targetSelection = selectionState.merge({
    anchorOffset: 2,
    focusOffset: 2
  });
  const targetEditor = EditorState.forceSelection(editorState, targetSelection);

  const resultEditor = insertCustomAtomicBlock(targetEditor, blockType);
  const resultContent = resultEditor.getCurrentContent();

  const firstBlock = resultContent.getBlockMap().first();
  expect(firstBlock.getType()).toBe(originalFirstBlock.getType());
  expect(firstBlock.getText()).toBe(originalFirstBlock.getText().slice(0, 2));

  const secondBlock = resultContent
    .getBlockMap()
    .skip(1)
    .first();
  assertAtomicBlock(secondBlock);

  const thirdBlock = resultContent
    .getBlockMap()
    .skip(2)
    .first();
  expect(thirdBlock.getType()).toBe(originalFirstBlock.getType());
  expect(thirdBlock.getText()).toBe(originalFirstBlock.getText().slice(2));
});

test('Collapsed cursor - must insert atomic after a block', () => {
  const targetSelection = selectionState.merge({
    anchorOffset: originalFirstBlock.getLength(),
    focusOffset: originalFirstBlock.getLength()
  });
  const targetEditor = EditorState.forceSelection(editorState, targetSelection);

  const resultEditor = insertCustomAtomicBlock(targetEditor, blockType);
  const resultContent = resultEditor.getCurrentContent();

  const firstBlock = resultContent.getBlockMap().first();
  expect(firstBlock.getType()).toBe(originalFirstBlock.getType());
  expect(firstBlock.getText()).toBe(originalFirstBlock.getText());

  const secondBlock = resultContent
    .getBlockMap()
    .skip(1)
    .first();
  assertAtomicBlock(secondBlock);

  const thirdBlock = resultContent
    .getBlockMap()
    .skip(2)
    .first();
  expect(thirdBlock.getType()).toBe(originalFirstBlock.getType());
  expect(thirdBlock.getText()).toBe('');
});

test('Non-collapsed cursor - must insert atomic at start of block', () => {
  const targetSelection = selectionState.merge({
    anchorOffset: 0,
    focusOffset: 2
  });
  const targetEditor = EditorState.forceSelection(editorState, targetSelection);

  const resultEditor = insertCustomAtomicBlock(targetEditor, blockType);
  const resultContent = resultEditor.getCurrentContent();

  const firstBlock = resultContent.getBlockMap().first();
  expect(firstBlock.getType()).toBe(originalFirstBlock.getType());
  expect(firstBlock.getText()).toBe('');

  const secondBlock = resultContent
    .getBlockMap()
    .skip(1)
    .first();
  assertAtomicBlock(secondBlock);

  const thirdBlock = resultContent
    .getBlockMap()
    .skip(2)
    .first();
  expect(thirdBlock.getType()).toBe(originalFirstBlock.getType());
  expect(thirdBlock.getText()).toBe(originalFirstBlock.getText().slice(2));
});

test('Non-collapsed cursor - must insert atomic within a block', () => {
  const targetSelection = selectionState.merge({
    anchorOffset: 1,
    focusOffset: 2
  });
  const targetEditor = EditorState.forceSelection(editorState, targetSelection);

  const resultEditor = insertCustomAtomicBlock(targetEditor, blockType);
  const resultContent = resultEditor.getCurrentContent();

  const firstBlock = resultContent.getBlockMap().first();
  expect(firstBlock.getType()).toBe(originalFirstBlock.getType());
  expect(firstBlock.getText()).toBe(originalFirstBlock.getText().slice(0, 1));

  const secondBlock = resultContent
    .getBlockMap()
    .skip(1)
    .first();
  assertAtomicBlock(secondBlock);

  const thirdBlock = resultContent
    .getBlockMap()
    .skip(2)
    .first();
  expect(thirdBlock.getType()).toBe(originalFirstBlock.getType());
  expect(thirdBlock.getText()).toBe(originalFirstBlock.getText().slice(2));
});

test('Non-collapsed cursor - must insert atomic at end of block', () => {
  const origLength = originalFirstBlock.getLength();
  const targetSelection = selectionState.merge({
    anchorOffset: origLength - 2,
    focusOffset: origLength
  });
  const targetEditor = EditorState.forceSelection(editorState, targetSelection);

  const resultEditor = insertCustomAtomicBlock(targetEditor, blockType);
  const resultContent = resultEditor.getCurrentContent();

  const firstBlock = resultContent.getBlockMap().first();
  expect(firstBlock.getType()).toBe(originalFirstBlock.getType());
  expect(firstBlock.getText()).toBe(originalFirstBlock.getText().slice(0, origLength - 2));

  const secondBlock = resultContent
    .getBlockMap()
    .skip(1)
    .first();
  assertAtomicBlock(secondBlock);

  const thirdBlock = resultContent
    .getBlockMap()
    .skip(2)
    .first();
  expect(thirdBlock.getType()).toBe(originalFirstBlock.getType());
  expect(thirdBlock.getText()).toBe('');
});

test('Non-collapsed cursor - must insert atomic for cross-block selection', () => {
  const originalThirdBlock = contentState
    .getBlockMap()
    .skip(2)
    .first();

  const targetSelection = selectionState.merge({
    anchorOffset: 2,
    focusKey: originalThirdBlock.getKey(),
    focusOffset: 2
  });
  const targetEditor = EditorState.forceSelection(editorState, targetSelection);

  const resultEditor = insertCustomAtomicBlock(targetEditor, blockType);
  const resultContent = resultEditor.getCurrentContent();

  const firstBlock = resultContent.getBlockMap().first();
  expect(firstBlock.getType()).toBe(originalFirstBlock.getType());
  expect(firstBlock.getText()).toBe(originalFirstBlock.getText().slice(0, 2));

  const secondBlock = resultContent
    .getBlockMap()
    .skip(1)
    .first();
  assertAtomicBlock(secondBlock);

  // Third block gets original first block's type, but sliced text from
  // original second block.
  const thirdBlock = resultContent
    .getBlockMap()
    .skip(2)
    .first();
  expect(thirdBlock.getType()).toBe(originalFirstBlock.getType());
  expect(thirdBlock.getText()).toBe(originalThirdBlock.getText().slice(2));
});
