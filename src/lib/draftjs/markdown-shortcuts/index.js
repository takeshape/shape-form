import handleBlockType from './handle-block-type';
import handleInlineStyle from './handle-inline-style';

const markdownShortcutsPlugin = () => {
  return {
    handleBeforeInput(character, editorState, {setEditorState}) {
      if (character !== ' ') {
        return 'not-handled';
      }
      let newEditorState = handleBlockType(editorState);
      if (editorState === newEditorState) {
        newEditorState = handleInlineStyle(editorState);
      }
      if (editorState !== newEditorState) {
        setEditorState(newEditorState);
        return 'handled';
      }
      return 'not-handled';
    }
  };
};

export default markdownShortcutsPlugin;
