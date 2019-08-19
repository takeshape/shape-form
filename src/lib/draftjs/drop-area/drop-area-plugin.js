import DropArea from './components/drop-area';
import {SelectionState, EditorState} from 'draft-js';
import {addImage} from '../image/modifiers';

export default () => {
  return {
    blockRendererFn: (block, {getEditorState, setEditorState}) => {
      if (block.getType() === 'unstyled') {
        return {
          component: DropArea,
          props: {
            createImageBlock(asset) {
              const selection = SelectionState.createEmpty(block.getKey()).set('focusOffset', 1);
              const stateWithNewSelection = EditorState.forceSelection(getEditorState(), selection);
              const newState = addImage(stateWithNewSelection, {
                id: asset.id,
                caption: asset.caption,
                credit: asset.credit
              });
              setEditorState(newState);
            },
            isBlockEmpty: block.getLength() === 0
          }
        };
      }

      return null;
    }
  };
};
