import {AtomicBlockUtils, RichUtils} from 'draft-js';

import * as types from '../constants';

export default function addOembed(editorState, props) {
  if (RichUtils.getCurrentBlockType(editorState) === types.ATOMIC) {
    return editorState;
  }
  const contentStateWithEntity = editorState.getCurrentContent().createEntity(types.OEMBEDTYPE, 'IMMUTABLE', props);
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  return AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');
}
