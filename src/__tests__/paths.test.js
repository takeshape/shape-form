import {reducerFactory, matches, pathToString} from '../paths';
import get from 'lodash/get';
import produce from 'immer';
import {updateIn} from '../util/immutable-util';

test('matches', async () => {
  const path = ['a', 'b', 'c', 'd'];
  expect(matches(path, ['d'])).toBe(true);
  expect(matches(path, ['c', 'd'])).toBe(true);
  expect(matches(path, ['b', 'c', 'd'])).toBe(true);
  expect(matches(path, ['a', 'b', 'c', 'd'])).toBe(true);

  expect(matches(path, ['z'])).toBe(false);
  expect(matches(path, ['c', 'z'])).toBe(false);
});

test('reducerFactory', async () => {
  const INCREMENT = 'increment';

  const initialState = {
    forms: {}
  };

  const reducers = {
    [INCREMENT](state, {meta}) {
      return produce(state, draft => {
        updateIn(draft, ['forms', meta.formName, 'data', 'x'], x => x + 1);
      });
    }
  };

  const pluginInitial = {
    data: {
      x: 0
    }
  };

  const plugins = {
    'test-form'(state = pluginInitial, {type}) {
      if (type === INCREMENT) {
        return produce(state, draft => {
          updateIn(draft, ['data', 'x'], x => x + 2);
        });
      }
      return state;
    }
  };

  const reducer = reducerFactory(initialState, reducers)(plugins);

  const action = {
    type: INCREMENT,
    meta: {
      formName: 'test-form'
    }
  };

  const newState = reducer(undefined, action);
  const x = get(newState, ['forms', 'test-form', 'data', 'x']);
  expect(x).toBe(3);
});

test('pathToString', () => {
  expect(pathToString(['a', 'b', 'c'])).toBe('a.b.c');
  expect(pathToString(['a', '0', 'b', 'c'])).toBe('a[0].b.c');
  expect(pathToString(['a', 0, 'b', 'c'])).toBe('a[0].b.c');
  expect(pathToString(['a', 'b', 2, 'c'])).toBe('a.b[2].c');
  expect(pathToString([0, 'a', 'b', 'c'])).toBe('[0].a.b.c');
});
