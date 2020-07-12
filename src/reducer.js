import {
  getFormPath,
  getKeysPath,
  getUiPath,
  getUiPropertiesPath,
  getStructuralChangesPath,
  getPlaceholderPath,
  getCollapsedPath,
  getDataPath,
  getSchemaPath,
  reducerFactory,
  getInitialDataPath,
  pathToString,
  PROPERTIES
} from './paths';
import {mergeIn, mergeInDeep, removeIn, removeIndex, setIn, updateIn} from './util/immutable-util';
import memoize from 'lodash/memoize';
import Ajv from 'ajv';
import isDirty from './util/is-dirty';
import {initStructuralChanges} from './util/structural-changes';
import get from 'lodash/get';
import range from 'lodash/range';
import max from 'lodash/max';
import produce, {enableMapSet} from 'immer';

enableMapSet();

const ajv = new Ajv({allErrors: true});

const compile = memoize(schema => ajv.compile(schema));

import {
  INIT_ARRAY,
  CLEAR_ARRAY,
  ADD_ARRAY_ITEM,
  SWAP_ARRAY_ITEMS,
  REMOVE_ARRAY_ITEM,
  INSERT_PLACEHOLDER,
  CLEAR_PLACEHOLDER,
  TOGGLE_ARRAY_ITEM,
  EXPAND_ALL_ARRAY_ITEMS,
  COLLAPSE_ALL_ARRAY_ITEMS,
  CHANGE_FIELD,
  FOCUS_FIELD,
  BLUR_FIELD,
  SET_UI,
  VALIDATE_FORM,
  REGISTER_FORM,
  CLEAR_FORM,
  SUBMIT_FORM
} from './action-types';
import {combineReducers} from 'redux';
import {NAME} from './constants';

const initialState = {
  forms: {}
};

function registerForm(state, {meta, payload}) {
  const schema = payload.schema;
  const initialData = payload.initialData || {};
  const initialDirty = payload.initialDirty;

  return produce(state, mutable => {
    mergeIn(mutable, getFormPath(meta.formName), {
      schema,
      initialData,
      data: initialData,
      errors: {},
      submitErrors: {},
      structuralChanges: initStructuralChanges(schema, initialData),
      dirty: initialDirty ? initialDirty : new Set(),
      touched: initialDirty ? initialDirty : new Set(),
      submitted: false
    });
  });
}

function clearForm(state, {meta}) {
  return produce(state, mutable => {
    removeIn(mutable, getFormPath(meta.formName));
    removeIn(mutable, getUiPath(meta));
  });
}

function initArray(state, {meta}) {
  const uiPath = getUiPropertiesPath(meta);
  const ui = get(state, uiPath);
  if (ui && ui.arrayKeys && ui.collapsed) {
    return state;
  }

  const array = get(state, getDataPath(meta));
  const indexes = array ? range(array.length) : [];
  return produce(state, draft => {
    mergeIn(draft, uiPath, {
      arrayKeys: indexes,
      collapsed: new Set()
    });
  });
}

function clearArray(state, {meta}) {
  return produce(state, draft => {
    removeIn(draft, getUiPath(meta));
  });
}

function getNextKey(keys) {
  return keys.size === 0 ? 0 : max(keys) + 1;
}

function updateStructuralChangeProps(updater) {
  return changes => changes && changes.update(PROPERTIES, props => props && updater(props));
}

function addKeyStructuralChange(state, meta) {
  const {index} = meta;
  return updateStructuralChangeProps(props => {
    const arrayKeys = props.arrayKeys;
    const nextKey = props.nextKey;
    return {
      ...props,
      arrayKeys: index === undefined ? arrayKeys.push(nextKey) : arrayKeys.insert(index, nextKey),
      nextKey: nextKey + 1
    };
  });
}

function removeKeyStructuralChange(state, meta) {
  const {index} = meta;
  return updateStructuralChangeProps(props => {
    const arrayKeys = props.arrayKeys;
    return {
      ...props,
      arrayKeys: arrayKeys.remove(index)
    };
  });
}

function insertItem(list, item, index) {
  if (index === undefined) {
    list.push(item);
  } else {
    list.splice(index, 0, item);
  }
  return list;
}

function addArrayItems(state, action) {
  const {meta, payload} = action;
  const {index} = meta;
  const item = payload;
  return produce(state, draft => {
    updateIn(draft, getDataPath(meta), list => (list ? insertItem(list, item, index) : [item]));
    updateIn(draft, getStructuralChangesPath(meta), addKeyStructuralChange(draft, meta));
    updateIn(draft, getKeysPath(meta), keys => (keys ? insertItem(keys, getNextKey(keys), index) : [0]));
    removeIn(draft, getPlaceholderPath(meta));
  });
}

function swapIn(mutableState, path, indexA, indexB) {
  const pathA = path.concat([indexA]);
  const pathB = path.concat([indexB]);
  const a = get(mutableState, pathA);
  const b = get(mutableState, pathB);

  if (a !== undefined && b !== undefined) {
    setIn(mutableState, pathA, b);
    setIn(mutableState, pathB, a);
  }
}

function swap(draft, indexA, indexB) {
  const a = draft[indexA];

  draft[indexA] = draft[indexB];
  draft[indexB] = a;
  return draft;
}

function copyOrDelete(draft, from, to) {
  const value = draft[from];
  if (value) {
    draft[to] = value;
  } else {
    delete draft[from];
  }
}

const arrayKeysPath = [PROPERTIES, 'arrayKeys'];

function swapChange(draft, indexA, indexB) {
  copyOrDelete(draft, indexA, indexB);
  copyOrDelete(draft, indexB, indexA);
  updateIn(draft, arrayKeysPath, keys => swap(keys, indexA, indexB));
  return draft;
}

function swapArrayItems(state, action) {
  return produce(state, draft => {
    const {meta} = action;
    setTouched(draft, action);

    updateIn(draft, getStructuralChangesPath(meta), changes => {
      return changes && swapChange(changes, meta.indexA, meta.indexB);
    });

    swapIn(draft, getDataPath(meta), meta.indexA, meta.indexB);
    updateIn(draft, getUiPath(meta), ui => ui && swapChange(ui, meta.indexA, meta.indexB));
  });
}

function removeArrayItem(state, {meta}) {
  return produce(state, draft => {
    updateIn(draft, getStructuralChangesPath(meta), removeKeyStructuralChange(draft, meta));
    updateIn(draft, getKeysPath(meta), keys => (keys ? removeIndex(keys, meta.index) : keys));
    updateIn(draft, getDataPath(meta), keys => (keys ? removeIndex(keys, meta.index) : keys));
  });
}

function insertPlaceholder(state, {meta, payload}) {
  return produce(state, draft => {
    setIn(draft, getPlaceholderPath(meta), {index: meta.index, value: payload});
  });
}

function clearPlaceholder(state, {meta}) {
  return produce(state, draft => {
    removeIn(draft, getPlaceholderPath(meta));
  });
}

function toggleArrayItem(state, {meta, payload}) {
  return produce(state, draft => {
    updateIn(draft, getCollapsedPath(meta), collapsed => {
      if (collapsed.has(payload)) {
        collapsed.delete(payload);
      } else {
        collapsed.add(payload);
      }
      return collapsed;
    });
  });
}

function expandAllArrayItems(state, {meta}) {
  return produce(state, draft => {
    setIn(draft, getCollapsedPath(meta), new Set());
  });
}

function getCollapseAllUpdate(obj, update = {}) {
  if (typeof obj === 'object' && obj !== null) {
    for (const key of Object.keys(obj)) {
      const value = obj[key];
      if (key === PROPERTIES) {
        const arrayKeys = value.arrayKeys;
        if (arrayKeys) {
          update[PROPERTIES] = {collapsed: new Set(arrayKeys)};
        }
      } else {
        update[key] = {};
        getCollapseAllUpdate(value, update[key]);
      }
    }
  }
  return update;
}

function collapseAllArrayItems(state, {meta}) {
  const uiPath = getUiPath(meta);
  const update = getCollapseAllUpdate(get(state, uiPath));
  return produce(state, draft => {
    mergeInDeep(draft, uiPath, update);
  });
}

function changeField(state, {meta, payload}) {
  return produce(state, draft => {
    setIn(draft, getDataPath(meta), payload === '' ? undefined : payload);
  });
}

function setUI(state, {meta, payload}) {
  return produce(state, draft => {
    mergeIn(draft, getUiPropertiesPath(meta), payload);
  });
}

function setDirty(dirty, path, isDirty) {
  const pathStr = pathToString(path);
  if (isDirty) {
    dirty.add(pathStr);
  } else {
    dirty.delete(pathStr);
  }
  return dirty;
}

function checkIsDirty(state, meta) {
  const initialData = get(state, getInitialDataPath(meta));
  const currentData = get(state, getDataPath(meta));

  return isDirty(initialData, currentData);
}

function focusField(state, {meta}) {
  const fieldPath = pathToString(meta.path);
  return produce(state, draft => {
    removeIn(draft, ['forms', meta.formName, 'errors', fieldPath]);
  });
}

const bracketRegex = /\['|']\./g;

export function normalizeDataPath(dataPath) {
  // chop off leading . and replace bracket notion with . notation
  return dataPath.substr(1).replace(bracketRegex, '.');
}

function setTouched(state, {meta}) {
  return produce(state, draft => {
    updateIn(draft, ['forms', meta.formName, 'touched'], touched => touched || new Set([pathToString(meta.path)]));
  });
}

export function getIsNullObject(error, data, path) {
  return error.keyword === 'type' && error.params.type === 'object' && get(data, path.split(/\.|\[|\]\./)) === null;
}

export function getParentSchemaPath(error) {
  const parts = error.schemaPath.substr(2).split('/');
  const propertiesIndex = parts.lastIndexOf('properties');
  return parts.slice(0, propertiesIndex);
}

export function getIsRequired(schema, name) {
  const required = schema.required;

  // required may be undefined
  return required && required.find(prop => prop === name);
}

export function getName(path) {
  return path.split('.').pop();
}

function validate(state, {meta}) {
  const submitted = get(state, ['forms', meta.formName, 'submitted']);
  const touched = get(state, ['forms', meta.formName, 'touched'], new Set());

  const errors = {};
  const schema = get(state, getSchemaPath(meta));
  if (schema) {
    const validate = compile(schema);
    const data = get(state, ['forms', meta.formName, 'data']);
    const valid = validate(data);
    if (!valid) {
      validate.errors.forEach(error => {
        let path;
        let isRequiredError = error.params && error.params.missingProperty;

        if (isRequiredError) {
          path = (error.dataPath ? normalizeDataPath(error.dataPath) + '.' : '') + error.params.missingProperty;
        } else {
          path = normalizeDataPath(error.dataPath);
        }

        if (path && (submitted || touched.has(path))) {
          const isNullObject = getIsNullObject(error, data, path);
          let ignoreError = isNullObject;
          if (isNullObject) {
            const parentPath = getParentSchemaPath(error);
            if (getIsRequired(get(schema, parentPath), getName(path))) {
              isRequiredError = true;
              ignoreError = false;
            }
          }

          if (!ignoreError) {
            errors[path] = isRequiredError ? 'This field is required.' : error.message;
          }
        }
      });
    }
  }

  return produce(state, draft => {
    // Check to see if the last touched field is dirty
    let dirty = get(draft, ['forms', meta.formName, 'dirty'], new Set());
    if (meta.path) {
      dirty = setDirty(dirty, meta.path, checkIsDirty(draft, meta));
    }
    mergeIn(draft, ['forms', meta.formName], {
      errors: errors,
      dirty
    });
  });
}

function submitForm(state, {meta}) {
  return produce(state, draft => {
    mergeIn(draft, ['forms', meta.formName], {
      submitErrors: {},
      submitted: true
    });
  });
}

function submitFormSuccess(state, {meta}) {
  return produce(state, draft => {
    mergeIn(draft, ['forms', meta.formName], {
      dirty: new Set(),
      touched: new Set(),
      structuralChanges: {}
    });
  });
}

export const createFormReducer = reducerFactory(initialState, {
  [REGISTER_FORM]: registerForm,
  [CLEAR_FORM]: clearForm,
  [INIT_ARRAY]: initArray,
  [CLEAR_ARRAY]: clearArray,
  [ADD_ARRAY_ITEM]: addArrayItems,
  [SWAP_ARRAY_ITEMS]: swapArrayItems,
  [REMOVE_ARRAY_ITEM]: removeArrayItem,
  [INSERT_PLACEHOLDER]: insertPlaceholder,
  [CLEAR_PLACEHOLDER]: clearPlaceholder,
  [TOGGLE_ARRAY_ITEM]: toggleArrayItem,
  [EXPAND_ALL_ARRAY_ITEMS]: expandAllArrayItems,
  [COLLAPSE_ALL_ARRAY_ITEMS]: collapseAllArrayItems,
  [CHANGE_FIELD]: changeField,
  [FOCUS_FIELD]: focusField,
  [BLUR_FIELD]: setTouched,
  [SET_UI]: setUI,
  [SUBMIT_FORM]: submitForm,
  [`${SUBMIT_FORM}_SUCCESS`]: submitFormSuccess,
  [VALIDATE_FORM]: validate
});

export const defaultReducer = combineReducers({[NAME]: createFormReducer()});
