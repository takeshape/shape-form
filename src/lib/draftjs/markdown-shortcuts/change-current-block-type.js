import {EditorState} from 'draft-js';
import {List} from 'immutable';

const changeCurrentBlockType = (editorState, type, startIndex) => {
  const currentContent = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const key = selection.getStartKey();
  const blockMap = currentContent.getBlockMap();
  const block = blockMap.get(key);
  const text = block.getText().substring(startIndex);
  const characterList = block.getCharacterList().slice(startIndex);
  const data = block.getData();
  const newBlock = block.merge({
    type,
    data,
    text: text || '',
    characterList: characterList || List()
  });

  const newSelection = selection.merge({
    anchorOffset: 0,
    focusOffset: 0
  });
  const newContentState = currentContent.merge({
    blockMap: blockMap.set(key, newBlock),
    selectionAfter: newSelection
  });
  return EditorState.push(editorState, newContentState, 'change-block-type');
};

export default changeCurrentBlockType;
