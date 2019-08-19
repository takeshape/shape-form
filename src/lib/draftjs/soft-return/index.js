import {RichUtils} from 'draft-js';

const softReturnPlugin = () => {
  return {
    handleReturn(command, editorState, {setEditorState}) {
      if (command.shiftKey) {
        const newState = RichUtils.insertSoftNewline(editorState);
        setEditorState(newState);
        return 'handled';
      }
      return 'not-handled';
    }
  };
};

export default softReturnPlugin;
