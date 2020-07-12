import merge from 'lodash/merge';
import set from 'lodash/set';
import update from 'lodash/update';

export const updateIn = update;
export const setIn = set;

export function removeIn(map, keyPath) {
  const lastIndex = keyPath.length - 1;
  return updateIn(map, keyPath.slice(0, lastIndex), parent => {
    if (typeof parent === 'object') {
      delete parent[keyPath[lastIndex]];
    }
    return parent;
  });
}

export function mergeIn(map, keyPath, value) {
  return updateIn(map, keyPath, current => ({...current, ...value}));
}

export function mergeInDeep(map, keyPath, value) {
  return updateIn(map, keyPath, current => merge(current, value));
}

export function removeIndex(array, i) {
  array.splice(i, 1);
  return array;
}
