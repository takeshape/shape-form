import {addImage, updateImage} from './modifiers';
import Image from './components/image-block';

export default () => {
  return {
    blockRendererFn: (block, {getEditorState, setEditorState}) => {
      if (block.getType() === 'atomic') {
        const contentState = getEditorState().getCurrentContent();
        const entityKey = block.getEntityAt(0);
        if (entityKey) {
          const entity = contentState.getEntity(entityKey);
          const type = entity.getType();
          if (type === 'image') {
            return {
              component: Image,
              editable: false,
              props: {
                onChange(asset) {
                  const editorState = getEditorState();
                  const newState = updateImage(editorState, block, asset);
                  setEditorState(newState);
                }
              }
            };
          }
        }
      }

      return null;
    },
    handleKeyCommand(command, editorState, {setEditorState}) {
      if (command === 'add-image') {
        setEditorState(addImage(editorState));
        return 'handled';
      }
      return 'not-handled';
    }
  };
};

export {addImage};
