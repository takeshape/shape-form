import {EditorState, SelectionState, Modifier} from 'draft-js';

const changeCurrentInlineStyle = (editorState, matchArr, style) => {
  const currentContent = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const key = selection.getStartKey();
  const {index} = matchArr;
  const blockMap = currentContent.getBlockMap();
  const block = blockMap.get(key);
  const currentInlineStyle = block.getInlineStyleAt(index);
  const newStyle = currentInlineStyle.merge([style]);
  const focusOffset = index + matchArr[0].length;
  const wordSelection = SelectionState.createEmpty(key).merge({
    anchorOffset: index,
    focusOffset
  });
  let newContentState = Modifier.replaceText(currentContent, wordSelection, matchArr[1], newStyle);
  newContentState = Modifier.insertText(newContentState, newContentState.getSelectionAfter(), ' ');
  const newEditorState = EditorState.push(editorState, newContentState, 'change-inline-style');
  return EditorState.forceSelection(newEditorState, newContentState.getSelectionAfter());
};

export default changeCurrentInlineStyle;
