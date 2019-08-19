import Decorator from './decorator';
import Draft, {Modifier, EditorState, SelectionState} from 'draft-js';
import CodeUtils from 'draft-js-code';
import CodeBlockWrapper from './components/code-block-wrapper';

const prismPlugin = () => {
  return {
    decorators: [new Decorator()],
    handleKeyCommand(command, editorState, {setEditorState}) {
      let newState;

      if (CodeUtils.hasSelectionInBlock(editorState)) {
        newState = CodeUtils.handleKeyCommand(editorState, command);
      }

      if (!newState) {
        newState = Draft.RichUtils.handleKeyCommand(editorState, command);
      }

      if (newState) {
        setEditorState(newState);
        return 'handled';
      }
      return 'not-handled';
    },
    handlePastedText(text, html, editorState, {setEditorState}) {
      if (CodeUtils.hasSelectionInBlock(editorState)) {
        const contentState = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const newContentState = Draft.Modifier.replaceText(contentState, selection, text);
        setEditorState(Draft.EditorState.push(editorState, newContentState, 'insert-characters'));
        return 'handled';
      }
      return 'not-handled';
    },
    keyBindingFn(e, editorState) {
      let command;

      if (CodeUtils.hasSelectionInBlock(editorState)) {
        command = CodeUtils.getKeyBinding(e);
      }
      if (command) {
        return command;
      }

      return Draft.getDefaultKeyBinding(e);
    },

    handleReturn(e, editorState, {setEditorState}) {
      if (!CodeUtils.hasSelectionInBlock(editorState)) {
        return 'not-handled';
      }

      setEditorState(CodeUtils.handleReturn(e, editorState));
      return 'handled';
    },

    handleTab(e, editorState, {setEditorState}) {
      if (!CodeUtils.hasSelectionInBlock(editorState)) {
        return;
      }

      setEditorState(CodeUtils.handleTab(e, editorState));
    },

    blockRendererFn(block, {getEditorState, setEditorState, setReadOnly}) {
      if (block.getType() === 'code-block') {
        return {
          component: CodeBlockWrapper,
          props: {
            changeLang: lang => {
              const editorState = getEditorState();
              const content = editorState.getCurrentContent();
              const selection = new SelectionState({
                anchorKey: block.getKey(),
                anchorOffset: 0,
                focusKey: block.getKey(),
                focusOffset: block.getLength()
              });
              const newContentState = Modifier.mergeBlockData(content, selection, {lang}, 'change-block-data');
              const newState = EditorState.push(editorState, newContentState);
              setEditorState(newState);
            },
            lang: block.getData().get('lang'),
            setReadOnly
          }
        };
      }

      return null;
    }
  };
};

export default prismPlugin;
