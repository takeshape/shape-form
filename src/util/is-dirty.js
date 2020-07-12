import isEqual from 'lodash/isEqual';

export default function isDirty(initialData, currentData) {
  if (initialData === undefined) {
    return currentData !== '' && currentData !== null && currentData !== undefined;
  }
  return !isEqual(initialData, currentData);
}
