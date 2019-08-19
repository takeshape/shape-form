import Draft from 'draft-js';

const basicKeyboardShortcutsPlugin = () => {
  return {
    handleKeyCommand(command, editorState, {setEditorState}) {
      const newState = Draft.RichUtils.handleKeyCommand(editorState, command);

      if (newState) {
        setEditorState(newState);
        return 'handled';
      }
      return 'not-handled';
    }
  };
};

export default basicKeyboardShortcutsPlugin;
