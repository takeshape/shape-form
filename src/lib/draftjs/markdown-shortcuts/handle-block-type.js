import changeCurrentBlockType from './change-current-block-type';
import countHashtags from './utils/count-hashtags';

const headerTypes = [null, 'header-one', 'header-two', 'header-three', 'header-four', 'header-five', 'header-six'];

const handleBlockType = editorState => {
  const currentSelection = editorState.getSelection();
  const {anchorOffset} = currentSelection;
  const key = currentSelection.getStartKey();
  const text = editorState
    .getCurrentContent()
    .getBlockForKey(key)
    .getText();
  const firstChar = text[0];
  if (anchorOffset === 1) {
    if (firstChar === '*' || firstChar === '-') {
      return changeCurrentBlockType(editorState, 'unordered-list-item', 1);
    }
    if (firstChar === '>') {
      return changeCurrentBlockType(editorState, 'blockquote', 1);
    }
  }
  if (firstChar === '#') {
    const hashtagCount = countHashtags(text);
    if (anchorOffset === hashtagCount) {
      return changeCurrentBlockType(editorState, headerTypes[hashtagCount], hashtagCount);
    }
  }
  const number = /^(\d+\.)/.exec(text);
  if (number) {
    const length = number[0].length;
    if (anchorOffset === length) {
      return changeCurrentBlockType(editorState, 'ordered-list-item', length);
    }
  }
  return editorState;
};

export default handleBlockType;
