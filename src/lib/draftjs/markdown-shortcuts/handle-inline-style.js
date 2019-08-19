import changeCurrentInlineStyle from './change-current-inline-style';

const handleInlineStyle = editorState => {
  const key = editorState.getSelection().getStartKey();
  const text = editorState
    .getCurrentContent()
    .getBlockForKey(key)
    .getText();
  let newEditorState = editorState;
  const code = /`([^`]+)`/.exec(text);
  if (code) {
    newEditorState = changeCurrentInlineStyle(newEditorState, code, 'CODE');
  }
  return newEditorState;
};

export default handleInlineStyle;
