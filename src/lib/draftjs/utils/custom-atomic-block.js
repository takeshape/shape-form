import {List} from 'immutable';
import {Modifier, BlockMapBuilder, EditorState, ContentBlock, genKey} from 'draft-js';

export function onBackspace(editorState, blockType) {
  const selection = editorState.getSelection();
  if (!selection.isCollapsed() || selection.getAnchorOffset() || selection.getFocusOffset()) {
    return null;
  }

  // First, try to remove a preceding atomic block.
  const content = editorState.getCurrentContent();
  const startKey = selection.getStartKey();
  const blockBefore = content.getBlockBefore(startKey);

  if (blockBefore && blockBefore.getType() === blockType) {
    const blockMap = content.getBlockMap().delete(blockBefore.getKey());
    const withoutAtomicBlock = content.merge({blockMap, selectionAfter: selection});
    if (withoutAtomicBlock !== content) {
      return EditorState.push(editorState, withoutAtomicBlock, 'remove-range');
    }
  }

  return null;
}

export function onDelete(editorState, blockType) {
  const selection = editorState.getSelection();
  if (!selection.isCollapsed()) {
    return null;
  }

  const content = editorState.getCurrentContent();
  const startKey = selection.getStartKey();
  const block = content.getBlockForKey(startKey);
  const length = block.getLength();

  // The cursor is somewhere within the text. Behave normally.
  if (selection.getStartOffset() < length) {
    return null;
  }

  const blockAfter = content.getBlockAfter(startKey);

  if (!blockAfter || blockAfter.getType() !== blockType) {
    return null;
  }

  const atomicBlockTarget = selection.merge({
    focusKey: blockAfter.getKey(),
    focusOffset: blockAfter.getLength()
  });

  const withoutAtomicBlock = Modifier.removeRange(content, atomicBlockTarget, 'forward');

  if (withoutAtomicBlock !== content) {
    return EditorState.push(editorState, withoutAtomicBlock, 'remove-range');
  }
  return null;
}

export function handleKeyCommand(editorState, blockType, command) {
  if (command === 'backspace' || command === 'backspace-word' || command === 'backspace-to-start-of-line') {
    return onBackspace(editorState, blockType);
  }
  if (command === 'delete' || command === 'delete-word' || command === 'delete-to-end-of-block') {
    return onDelete(editorState, blockType);
  }
}

export function insertCustomAtomicBlock(editorState, blockType) {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();

  const afterRemoval = Modifier.removeRange(contentState, selectionState, 'backward');

  const targetSelection = afterRemoval.getSelectionAfter();
  const afterSplit = Modifier.splitBlock(afterRemoval, targetSelection);
  const insertionTarget = afterSplit.getSelectionAfter();

  const asAtomicBlock = Modifier.setBlockType(afterSplit, insertionTarget, 'atomic');

  const fragmentArray = [
    new ContentBlock({
      key: genKey(),
      type: blockType,
      text: ' ',
      characterList: List()
    }),
    new ContentBlock({
      key: genKey(),
      type: 'unstyled',
      text: '',
      characterList: List()
    })
  ];

  const fragment = BlockMapBuilder.createFromArray(fragmentArray);

  const withAtomicBlock = Modifier.replaceWithFragment(asAtomicBlock, insertionTarget, fragment);

  const newContent = withAtomicBlock.merge({
    selectionBefore: selectionState,
    selectionAfter: withAtomicBlock.getSelectionAfter().set('hasFocus', true)
  });

  return EditorState.push(editorState, newContent, 'insert-fragment');
}
