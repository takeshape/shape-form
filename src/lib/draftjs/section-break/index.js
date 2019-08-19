import horizontalRule from './components/section-break';
import {insertCustomAtomicBlock, handleKeyCommand} from '../utils/custom-atomic-block';

export const blockType = 'section-break';

function addSectionBreak(editorState) {
  return insertCustomAtomicBlock(editorState, blockType);
}

export default () => {
  return {
    blockRendererFn: block => {
      if (block.getType() === blockType) {
        return {
          component: horizontalRule,
          editable: false,
          props: {}
        };
      }
      return null;
    },
    handleKeyCommand(command, editorState, {setEditorState}) {
      if (command === 'section-break') {
        setEditorState(addSectionBreak(editorState));
        return 'handled';
      }

      const newEditorState = handleKeyCommand(editorState, blockType, command);
      if (newEditorState) {
        setEditorState(newEditorState);
        return 'handled';
      }

      return 'not-handled';
    }
  };
};

export {addSectionBreak};
