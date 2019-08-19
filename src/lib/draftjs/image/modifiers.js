import {AtomicBlockUtils, EditorState, SelectionState, Modifier} from 'draft-js';

export function addImage(editorState, data) {
  const contentStateWithEntity = editorState.getCurrentContent().createEntity('image', 'IMMUTABLE', data);
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  return AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');
}

export function updateImage(editorState, block, newData) {
  const contentState = editorState.getCurrentContent();
  const entityKey = block.getEntityAt(0);
  if (!entityKey) {
    return editorState;
  }

  const data = contentState.getEntity(entityKey).getData();
  const contentStateWithEntity = contentState.createEntity('image', 'IMMUTABLE', {...data, ...newData});
  const newEntityKey = contentStateWithEntity.getLastCreatedEntityKey();

  const selection = SelectionState.createEmpty(block.getKey()).set('focusOffset', 1);

  const newContentState = Modifier.applyEntity(contentStateWithEntity, selection, newEntityKey);

  return EditorState.push(editorState, newContentState, 'apply-entity');
}
