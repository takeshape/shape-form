import {Map, List} from 'immutable';
import memoize from 'lodash/memoize';

const EMPTY_MAP = Map();
const EMPTY_LIST = List();
const NOT_SET = {};

const isNumber = memoize(str => /^\d+$/.test(str));

export function updateIn(map, keyPath, notSetValue, updater) {
  if (typeof notSetValue === 'function') {
    updater = notSetValue;
    notSetValue = undefined;
  }

  let current;
  let i;

  const length = keyPath.length;
  const last = length - 1;
  const refs = new Array(length);

  for (i = 0; i < length; i++) {
    current = (current || map).get(keyPath[i], NOT_SET);
    if (i === last) {
      current = updater(current === NOT_SET ? notSetValue : current);
    } else if (current === NOT_SET) {
      current = isNumber(keyPath[i + 1]) ? EMPTY_LIST : EMPTY_MAP;
    } else if (!current || !current.set) {
      throw new Error('invalid path');
    }

    refs[i] = current;
  }

  let updated = refs[last];
  for (i = length; i--; ) {
    updated = (refs[i - 1] || map).set(keyPath[i], updated);
  }

  return updated;
}

export function setIn(map, keyPath, value) {
  return updateIn(map, keyPath, () => value);
}
