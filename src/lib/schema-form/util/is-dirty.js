import {is} from 'immutable';
import {EditorState} from 'draft-js';

export default function isDirty(initialData, currentData) {
  if (currentData instanceof EditorState) {
    if (initialData) {
      return !is(initialData.getCurrentContent().getBlockMap(), currentData.getCurrentContent().getBlockMap());
    }
    return currentData.getCurrentContent().hasText();
  }
  if (initialData === undefined) {
    return currentData !== '' && currentData !== null && currentData !== undefined;
  }
  return !is(initialData, currentData);
}
