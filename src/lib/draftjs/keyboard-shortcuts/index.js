import {getDefaultKeyBinding, RichUtils} from 'draft-js';
import {bindings, isSimpleCommand, toggleSimpleCommand} from './key-bindings';

const keyboardShortcutsPlugin = () => {
  return {
    keyBindingFn(e) {
      const bindingLookupKey = e.keyCode.toString();
      if (bindings[bindingLookupKey] && e.altKey && e.metaKey) {
        return bindings[bindingLookupKey];
      }
      return getDefaultKeyBinding(e);
    },

    handleKeyCommand(command, editorState, {setEditorState}) {
      const newState = RichUtils.handleKeyCommand(editorState, command);
      if (isSimpleCommand(command)) {
        setEditorState(toggleSimpleCommand(command, editorState));
        return 'handled';
      }
      if (newState) {
        setEditorState(newState);
        return 'handled';
      }
      return 'not-handled';
    }
  };
};

export default keyboardShortcutsPlugin;
