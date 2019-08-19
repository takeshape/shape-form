import {RichUtils} from 'draft-js';

export function getSelectionEntity(editorState) {
  let entity;
  const selection = editorState.getSelection();
  let start = selection.getStartOffset();
  let end = selection.getEndOffset();
  if (start === end && start === 0) {
    end = 1;
  } else if (start === end) {
    start -= 1;
  }

  const contentState = editorState.getCurrentContent();
  const block = contentState.getBlockForKey(selection.getStartKey());

  for (let i = start; i < end; i += 1) {
    const currentEntity = block.getEntityAt(i);
    if (!currentEntity) {
      entity = undefined;
      break;
    }
    if (i === start) {
      entity = currentEntity;
    } else if (entity !== currentEntity) {
      entity = undefined;
      break;
    }
  }
  return entity;
}

export function addLink(editorState, url, target) {
  const contentStateWithEntity = editorState.getCurrentContent().createEntity('LINK', 'MUTABLE', {url, target});
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  return RichUtils.toggleLink(editorState, editorState.getSelection(), entityKey);
}

export function removeLink(editorState) {
  return RichUtils.toggleLink(editorState, editorState.getSelection(), null);
}

export function getLink(editorState) {
  const entityKey = getSelectionEntity(editorState);
  if (entityKey) {
    const entity = editorState.getCurrentContent().getEntity(entityKey);
    if (entity && entity.getType() === 'LINK') {
      return entity.getData();
    }
  }

  return null;
}

export function toggleLink(editorState, link) {
  const {url, target} = link;
  return url ? addLink(editorState, url, target) : removeLink(editorState);
}
