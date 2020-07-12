import get from 'lodash/get';
import set from 'lodash/set';
import produce from 'immer';
import {getDataPath, getKeysPath, getCollapsedPath, PROPERTIES, getPlaceholderPath} from '../paths';
import {
  createFormReducer,
  normalizeDataPath,
  getIsNullObject,
  getParentSchemaPath,
  getIsRequired,
  getName
} from '../reducer';
import {menuFormState} from './data/pizza-party-sample';

import {CHANGE_FIELD, VALIDATE_FORM, BLUR_FIELD, SUBMIT_FORM} from '../action-types';

import {
  clearForm,
  bindMeta,
  addArrayItem,
  removeArrayItem,
  swapArrayItems,
  insertArrayItemPlaceholder,
  clearArrayItemPlaceholder,
  toggleArrayItem,
  expandAllArrayItems,
  collapseAllArrayItems,
  submitForm
} from '../actions';
import {mergeIn, removeIn, setIn} from '../util/immutable-util';

const reducer = createFormReducer();

const sampleData = {
  name: 'andrew',
  age: 31,
  coordinates: [{x: 100, y: 200}, {x: 100, y: 200}, {x: 100, y: 200}]
};

const sampleSchema = {
  type: 'object',
  properties: {
    name: {type: 'string'},
    age: {type: 'integer', min: 18},
    coordinates: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          x: {type: 'integer'},
          y: {type: 'integer'}
        }
      },
      minItems: 1
    }
  },
  required: ['name', 'age', 'coordinates']
};

const testFormState = {
  forms: {
    'test-form': {
      data: sampleData,
      initialData: sampleData,
      schema: sampleSchema,
      errors: {},
      submitted: false,
      dirty: new Set(),
      ui: {
        coordinates: {
          [PROPERTIES]: {
            arrayKeys: [0, 1, 2],
            collapsed: new Set([1])
          }
        }
      }
    }
  }
};

test('reducer - intial state', () => {
  const newState = reducer(undefined, {});

  const expected = {
    forms: {}
  };

  expect(newState).toEqual(expected);
});

const bindCoordinates = bindMeta('test-form', 'coordinates');
const swapItems = bindCoordinates(swapArrayItems);
const addItem = bindCoordinates(addArrayItem);
const removeItem = bindCoordinates(removeArrayItem);
const toggleItem = bindCoordinates(toggleArrayItem);
const expandAllItems = bindCoordinates(expandAllArrayItems);
const insertPlaceholder = bindCoordinates(insertArrayItemPlaceholder);
const clearPlaceholder = bindCoordinates(clearArrayItemPlaceholder);

test('SWAP_ARRAY_ITEMS', () => {
  const action = swapItems(0, 1);

  const newState = reducer(testFormState, action);
  const keys = get(newState, getKeysPath(action.meta));
  expect(keys).toEqual([1, 0, 2]);

  const data = get(newState, getDataPath(action.meta));
  expect(data).toEqual([sampleData.coordinates[1], sampleData.coordinates[0], sampleData.coordinates[2]]);
});

test('ADD_ARRAY_ITEM', () => {
  const action = addItem({});

  const newState = reducer(testFormState, action);
  const keys = get(newState, getKeysPath(action.meta));
  expect(keys).toEqual([0, 1, 2, 3]);

  const data = get(newState, getDataPath(action.meta));
  expect(data).toEqual([...sampleData.coordinates, action.payload]);
});

test('ADD_ARRAY_ITEM - specified index', () => {
  const action = addItem({foo: 'bar'}, 2);

  const newState = reducer(testFormState, action);
  const keys = get(newState, getKeysPath(action.meta));
  expect(keys).toEqual([0, 1, 3, 2]);

  const data = get(newState, getDataPath(action.meta))[action.meta.index];
  expect(data).toEqual(action.payload);
});

test('ADD_ARRAY_ITEM - specified index empty', () => {
  const initialState = {
    forms: {
      'test-form': {
        schema: sampleSchema,
        errors: {}
      }
    }
  };

  const action = addItem({foo: 'bar'}, 0);

  const newState = reducer(initialState, action);
  const keys = get(newState, getKeysPath(action.meta));
  expect(keys).toEqual([0]);

  const data = get(newState, getDataPath(action.meta));
  expect(data).toEqual([action.payload]);
});

test('ADD_ARRAY_ITEM - clears placeholder', () => {
  const value = {foo: 'bar'};
  const action = addItem(value, 0);
  const placeholderPath = getPlaceholderPath(action.meta);
  const initialState = produce(testFormState, draft => set(draft, placeholderPath, {index: 0, value}));

  const newState = reducer(initialState, action);
  expect(get(newState, placeholderPath)).toBe(undefined);
});

test('ADD_ARRAY_ITEM - empty', () => {
  const initialState = {
    forms: {
      'test-form': {
        schema: sampleSchema,
        errors: {}
      }
    }
  };

  const action = addItem({foo: 'bar'});

  const newState = reducer(initialState, action);
  const keys = get(newState, getKeysPath(action.meta));
  expect(keys).toEqual([0]);

  const data = get(newState, getDataPath(action.meta));
  expect(data).toEqual([action.payload]);
});

test('ADD_ARRAY_ITEM - after REMOVE_ARRAY_ITEM', () => {
  const removeAction = removeItem(0);

  let newState = reducer(testFormState, removeAction);

  const addAction = addItem({});

  newState = reducer(newState, addAction);

  const keys = get(newState, getKeysPath(addAction.meta));
  expect(keys).toEqual([1, 2, 3]);

  const data = get(newState, getDataPath(addAction.meta));
  expect(data).toEqual([...sampleData.coordinates.slice(1), addAction.payload]);
});

test('REMOVE_ARRAY_ITEM', () => {
  const action = removeItem(1);

  const newState = reducer(testFormState, action);
  const keys = get(newState, getKeysPath(action.meta));
  expect(keys).toEqual([0, 2]);

  const data = get(newState, getDataPath(action.meta));
  expect(data).toEqual([sampleData.coordinates[0], sampleData.coordinates[2]]);
});

test('INSERT_PLACEHOLDER', () => {
  const value = {foo: 'bar'};
  const action = insertPlaceholder(value, 2);
  const placeholderPath = getPlaceholderPath(action.meta);

  const newState = reducer(testFormState, action);
  expect(get(newState, placeholderPath)).toEqual({index: 2, value});
});

test('CLEAR_PLACEHOLDER - clears placeholder', () => {
  const value = {foo: 'bar'};
  const action = clearPlaceholder(value, 0);
  const placeholderPath = getPlaceholderPath(action.meta);
  const initialState = produce(testFormState, draft => setIn(draft, {index: 0, value}));

  const newState = reducer(initialState, action);
  expect(get(newState, placeholderPath)).toBe(undefined);
});

test('TOGGLE_ARRAY_ITEM - expand', () => {
  const action = toggleItem(1);

  const newState = reducer(testFormState, action);
  const collapsed = get(newState, getCollapsedPath(action.meta));
  expect(collapsed.size).toBe(0);
});

test('TOGGLE_ARRAY_ITEM - collapse', () => {
  const action = toggleItem(0);

  const newState = reducer(testFormState, action);
  const collapsed = get(newState, getCollapsedPath(action.meta));
  expect(collapsed.size).toBe(2);
  expect(collapsed.has(0)).toBe(true);
  expect(collapsed.has(1)).toBe(true);
});

test('EXPAND_ALL_ARRAY_ITEMS', () => {
  const action = expandAllItems();

  const newState = reducer(testFormState, action);
  const collapsed = get(newState, getCollapsedPath(action.meta));
  expect(collapsed.size).toBe(0);
});

test('COLLAPSE_ALL_ARRAY_ITEMS - top level', () => {
  const formName = 'test-form';
  const action = bindMeta(formName, 'menu')(collapseAllArrayItems)();

  const newState = reducer(menuFormState, action);
  let collapsed = get(newState, getCollapsedPath({formName, path: ['menu']}));
  expect(collapsed).toEqual(new Set([0, 1]));

  collapsed = get(newState, getCollapsedPath({formName, path: ['menu', '0', 'items']}));
  expect(collapsed).toEqual(new Set([0, 1]));

  collapsed = get(
    newState,
    getCollapsedPath({
      formName,
      path: ['menu', '0', 'items', '0', 'ingredients']
    })
  );
  expect(collapsed).toEqual(new Set([0, 1, 2, 3]));

  collapsed = get(
    newState,
    getCollapsedPath({
      formName,
      path: ['menu', '0', 'items', '1', 'ingredients']
    })
  );
  expect(collapsed).toEqual(new Set([0, 1, 2]));

  collapsed = get(newState, getCollapsedPath({formName, path: ['menu', '1', 'items']}));
  expect(collapsed).toEqual(new Set([0]));

  collapsed = get(
    newState,
    getCollapsedPath({
      formName,
      path: ['menu', '1', 'items', '0', 'ingredients']
    })
  );
  expect(collapsed).toEqual(new Set([0, 1, 2]));
});

test('COLLAPSE_ALL_ARRAY_ITEMS - one level deep', () => {
  const formName = 'test-form';
  const action = bindMeta(formName, 'menu.0.items')(collapseAllArrayItems)();

  const newState = reducer(menuFormState, action);
  let collapsed = get(newState, getCollapsedPath({formName, path: ['menu']}));
  expect(collapsed).toEqual(new Set());

  collapsed = get(newState, getCollapsedPath({formName, path: ['menu', '0', 'items']}));
  expect(collapsed).toEqual(new Set([0, 1]));

  collapsed = get(
    newState,
    getCollapsedPath({
      formName,
      path: ['menu', '0', 'items', '0', 'ingredients']
    })
  );
  expect(collapsed).toEqual(new Set([0, 1, 2, 3]));

  collapsed = get(
    newState,
    getCollapsedPath({
      formName,
      path: ['menu', '0', 'items', '1', 'ingredients']
    })
  );
  expect(collapsed).toEqual(new Set([0, 1, 2]));

  collapsed = get(newState, getCollapsedPath({formName, path: ['menu', '1', 'items']}));
  expect(collapsed).toEqual(new Set());

  collapsed = get(
    newState,
    getCollapsedPath({
      formName,
      path: ['menu', '1', 'items', '0', 'ingredients']
    })
  );
  expect(collapsed).toEqual(new Set());
});

test('VALIDATE_FORM', () => {
  const validateAction = {
    type: VALIDATE_FORM,
    meta: {
      formName: 'test-form',
      path: ['name']
    }
  };

  const changeAction = {
    type: CHANGE_FIELD,
    meta: {
      formName: 'test-form',
      path: ['name']
    },
    payload: undefined
  };

  const blurAction = {
    type: BLUR_FIELD,
    meta: {
      formName: 'test-form',
      path: ['name']
    },
    payload: undefined
  };

  const intermediateState = reducer(testFormState, changeAction);
  const invalidState = reducer(intermediateState, blurAction);

  const newState = reducer(invalidState, validateAction);
  const nameError = get(newState, ['forms', 'test-form', 'errors', 'name']);
  expect(get(newState, ['forms', 'test-form', 'dirty']).has('name')).toBe(true);
  expect(typeof nameError).toBe('string');
});

test('VALIDATE_FORM - dirty', () => {
  const validateAction = {
    type: VALIDATE_FORM,
    meta: {
      formName: 'test-form'
    }
  };

  // remove age data without setting it as dirty
  let invalidState = produce(testFormState, draft => removeIn(draft, ['forms', 'test-form', 'data', 'age']));

  const changeAction = {
    type: CHANGE_FIELD,
    meta: {
      formName: 'test-form',
      path: ['name']
    },
    payload: undefined
  };

  const blurAction = {
    type: BLUR_FIELD,
    meta: {
      formName: 'test-form',
      path: ['name']
    },
    payload: undefined
  };

  // change action will set name as dirty
  const intermediateState = reducer(testFormState, changeAction);
  invalidState = reducer(intermediateState, blurAction);

  const newState = reducer(invalidState, validateAction);
  const nameError = get(newState, ['forms', 'test-form', 'errors', 'name']);
  expect(typeof nameError).toBe('string');

  const ageError = get(newState, ['forms', 'test-form', 'errors', 'age']);
  expect(typeof ageError).toBe('undefined');
});

test('VALIDATE_FORM - submitted', () => {
  const validateAction = {
    type: VALIDATE_FORM,
    meta: {
      formName: 'test-form'
    }
  };

  // set submitted to true
  const invalidState = produce(testFormState, draft => {
    setIn(draft, ['forms', 'test-form', 'submitted'], true);
    removeIn(draft, ['forms', 'test-form', 'data', 'age']);
    removeIn(draft, ['forms', 'test-form', 'data', 'name']);
  });

  const newState = reducer(invalidState, validateAction);
  const nameError = get(newState, ['forms', 'test-form', 'errors', 'name']);
  expect(typeof nameError).toBe('string');

  const ageError = get(newState, ['forms', 'test-form', 'errors', 'age']);
  expect(typeof ageError).toBe('string');
});

test('normalizeDataPath', () => {
  expect(normalizeDataPath('.properties.abcdefghi.relationship')).toBe('properties.abcdefghi.relationship');
  // test bracket notation
  expect(normalizeDataPath(".properties['Sy3wKf-fe'].relationship")).toBe('properties.Sy3wKf-fe.relationship');
});

const isNullObjectData = {
  restaurant: {
    menu: {
      desserts: {
        cakes: ['chocolate', null]
      },
      brunch: null,
      specials: [{name: 'cereal and milk'}, {name: 'french fries'}, {name: null}]
    }
  }
};

test('getIsNullObject - incorrect error keyword', () => {
  const error = {
    keyword: 'test',
    params: {
      type: 'object'
    }
  };
  const path = 'restaurant.menu.brunch';

  expect(getIsNullObject(error, isNullObjectData, path)).toBeFalsy();
});

test('getIsNullObject - incorrect error type', () => {
  const error = {
    keyword: 'type',
    params: {
      type: 'test'
    }
  };
  const path = 'restaurant.menu.brunch';

  expect(getIsNullObject(error, isNullObjectData, path)).toBeFalsy();
});

test('getIsNullObject - path separated by .', () => {
  const error = {
    keyword: 'type',
    params: {
      type: 'object'
    }
  };
  const path = 'restaurant.menu.brunch';

  expect(getIsNullObject(error, isNullObjectData, path)).toBeTruthy();
});

test('getIsNullObject - path separated by . and [/d+] nested', () => {
  const error = {
    keyword: 'type',
    params: {
      type: 'object'
    }
  };
  const path = 'restaurant.menu.specials[2].name';

  expect(getIsNullObject(error, isNullObjectData, path)).toBeTruthy();
});

test('getParentSchemaPath', () => {
  const error = {
    keyword: 'type',
    message: 'should be object',
    dataPath: '.radAuthors[0].repeater[0].repeater1[0].relationship',
    params: {
      type: 'object'
    },
    schemaPath:
      '#/properties/radAuthors/items/properties/repeater/items/properties/repeater1/items/properties/relationship/type'
  };
  const expected = [
    'properties',
    'radAuthors',
    'items',
    'properties',
    'repeater',
    'items',
    'properties',
    'repeater1',
    'items'
  ];

  expect(getParentSchemaPath(error)).toEqual(expected);
});

test('getIsRequired', () => {
  expect(getIsRequired({required: ['not me', 'nor me']}, 'relationship')).toBeFalsy();
  expect(getIsRequired({required: ['not me', 'relationship']}, 'relationship')).toBeTruthy();
});

test('getName', () => {
  expect(getName('radAuthors[0].repeater[0].repeater1[0].relationship')).toBe('relationship');
});

test('CLEAR_FORM', () => {
  const formName = 'test-form';
  const state = reducer(testFormState, clearForm(formName));
  expect(get(state, ['forms', formName])).toBe(undefined);
});

test('SUBMIT_FORM', () => {
  const formName = 'test-form';
  const touched = new Set(['name', 'age']);
  const dirty = new Set(['name']);
  const formState = produce(testFormState, draft =>
    mergeIn(draft, ['forms', formName], {
      dirty,
      touched
    })
  );
  const state = reducer(formState, submitForm(formName));
  const newFormState = get(state, ['forms', formName]);
  expect(newFormState.dirty).toBe(dirty);
  expect(newFormState.touched).toBe(touched);
  expect(Object.keys(newFormState.submitErrors).length).toBe(0);
  expect(newFormState.submitted).toBe(true);
});

test('SUBMIT_FORM_SUCCESS', () => {
  const formName = 'test-form';
  const touched = new Set(['name', 'age']);
  const dirty = new Set(['name']);
  const formState = produce(testFormState, draft =>
    mergeIn(draft, ['forms', formName], {
      dirty,
      touched,
      submitted: true,
      submitErrors: {}
    })
  );
  const action = {type: `${SUBMIT_FORM}_SUCCESS`, meta: {formName}};
  const state = reducer(formState, action);
  const newFormState = get(state, ['forms', formName]);
  expect(newFormState.dirty.size).toBe(0);
  expect(newFormState.touched.size).toBe(0);
  expect(Object.keys(newFormState.submitErrors).length).toBe(0);
  expect(newFormState.submitted).toBe(true);
});
