import {is} from 'immutable';

export default function isDirty(initialData, currentData) {
  if (initialData === undefined) {
    return currentData !== '' && currentData !== null && currentData !== undefined;
  }
  return !is(initialData, currentData);
}
