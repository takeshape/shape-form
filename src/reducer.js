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
import {Map, List, Range, Set, fromJS} from 'immutable';
import {setIn} from './util/immutable-util';
import memoize from 'lodash/memoize';
import Ajv from 'ajv';
import isDirty from './util/is-dirty';
import {initStructuralChanges} from './util/structural-changes';

const ajv = new Ajv({allErrors: true});

const emptyMap = Map();
const emptySet = Set();
const toJS = memoize(iobj => (iobj && iobj.toJS ? iobj.toJS() : iobj));
const compile = memoize(schema => ajv.compile(toJS(schema)));

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

const initialState = Map({
  forms: Map()
});

function registerForm(state, {meta, payload}) {
  const schema = fromJS(payload.schema);
  const initialData = payload.initialData || {};
  const initialDirty = payload.initialDirty;

  return state.mergeIn(getFormPath(meta.formName), {
    schema,
    initialData,
    data: initialData,
    errors: emptyMap,
    submitErrors: emptyMap,
    structuralChanges: initStructuralChanges(schema, initialData),
    dirty: initialDirty ? initialDirty : emptySet,
    touched: initialDirty ? initialDirty : emptySet,
    submitted: false
  });
}

function clearForm(state, {meta}) {
  return state.withMutations(mutable => {
    mutable.removeIn(getFormPath(meta.formName));
    mutable.removeIn(getUiPath(meta));
  });
}

function initArray(state, {meta}) {
  const uiPath = getUiPropertiesPath(meta);
  const ui = state.getIn(uiPath);
  if (ui && ui.get('arrayKeys') && ui.get('collapsed')) {
    return state;
  }

  const array = state.getIn(getDataPath(meta));
  const indexes = array ? Range(0, array.size).toList() : List();
  return state.mergeIn(uiPath, {
    arrayKeys: indexes,
    collapsed: emptySet
  });
}

function clearArray(state, {meta}) {
  return state.removeIn(getUiPath(meta));
}

function getNextKey(keys) {
  return keys.size === 0 ? 0 : keys.max() + 1;
}

function updateStructuralChangeProps(updater) {
  return changes => changes && changes.update(PROPERTIES, props => props && updater(props));
}

function addKeyStructuralChange(state, meta) {
  const {index} = meta;
  return updateStructuralChangeProps(props => {
    const arrayKeys = props.get('arrayKeys');
    const nextKey = props.get('nextKey');
    return props.merge({
      arrayKeys: index === undefined ? arrayKeys.push(nextKey) : arrayKeys.insert(index, nextKey),
      nextKey: nextKey + 1
    });
  });
}

function removeKeyStructuralChange(state, meta) {
  const {index} = meta;
  return updateStructuralChangeProps(props => {
    const arrayKeys = props.get('arrayKeys');
    return props.merge({
      arrayKeys: arrayKeys.remove(index)
    });
  });
}

function insertItem(list, item, index) {
  return index === undefined ? list.push(item) : list.insert(index, item);
}

function addArrayItems(state, action) {
  const {meta, payload} = action;
  const {index} = meta;
  const item = fromJS(payload);
  return state.withMutations(mutableState => {
    mutableState
      .updateIn(getDataPath(meta), list => (list ? insertItem(list, item, index) : List.of(item)))
      .updateIn(getStructuralChangesPath(meta), addKeyStructuralChange(mutableState, meta))
      .updateIn(getKeysPath(meta), keys => (keys ? insertItem(keys, getNextKey(keys), index) : List.of(0)));

    clearPlaceholder(mutableState, action);
  });
}

function swapIn(mutableState, path, indexA, indexB) {
  const pathA = path.concat([indexA]);
  const pathB = path.concat([indexB]);
  const a = mutableState.getIn(pathA);
  const b = mutableState.getIn(pathB);

  if (a !== undefined && b !== undefined) {
    mutableState.setIn(pathA, b).setIn(pathB, a);
  }
}

function swap(state, indexA, indexB) {
  const a = state.get(indexA);
  const b = state.get(indexB);
  return state.set(indexA, b).set(indexB, a);
}

function copyOrDelete(state, from, to) {
  const value = state.get(from);
  return value ? state.set(to, value) : state.delete(from);
}

const arrayKeysPath = [PROPERTIES, 'arrayKeys'];

function swapChange(state, indexA, indexB) {
  return state.withMutations(mutableState => {
    const pathA = String(indexA);
    const pathB = String(indexB);
    copyOrDelete(mutableState, pathA, pathB);
    copyOrDelete(mutableState, pathB, pathA);
    mutableState.updateIn(arrayKeysPath, keys => swap(keys, indexA, indexB));
  });
}

function swapArrayItems(state, action) {
  return state.withMutations(mutableState => {
    const {meta} = action;
    setTouched(mutableState, action);

    mutableState.updateIn(getStructuralChangesPath(meta), changes => {
      return changes && swapChange(changes, meta.indexA, meta.indexB);
    });

    swapIn(mutableState, getDataPath(meta), meta.indexA, meta.indexB);
    mutableState.updateIn(getUiPath(meta), ui => ui && swapChange(ui, meta.indexA, meta.indexB));
  });
}

function removeArrayItem(state, {meta}) {
  return state.withMutations(mutableState => {
    mutableState
      .updateIn(getStructuralChangesPath(meta), removeKeyStructuralChange(mutableState, meta))
      .updateIn(getKeysPath(meta), keys => (keys ? keys.remove(meta.index) : keys))
      .updateIn(getDataPath(meta), keys => (keys ? keys.remove(meta.index) : keys));
  });
}

function insertPlaceholder(state, {meta, payload}) {
  return state.setIn(getPlaceholderPath(meta), Map({index: meta.index, value: payload}));
}

function clearPlaceholder(state, {meta}) {
  return state.removeIn(getPlaceholderPath(meta));
}

function toggleArrayItem(state, {meta, payload}) {
  return state.updateIn(getCollapsedPath(meta), collapsed =>
    collapsed.has(payload) ? collapsed.remove(payload) : collapsed.add(payload)
  );
}

function expandAllArrayItems(state, {meta}) {
  return state.setIn(getCollapsedPath(meta), emptySet);
}

function getCollapseAllUpdate(obj, update = {}) {
  if (Map.isMap(obj)) {
    obj.forEach((value, key) => {
      if (key === PROPERTIES) {
        const arrayKeys = value.get('arrayKeys');
        if (arrayKeys) {
          update[PROPERTIES] = {collapsed: arrayKeys.toSet()};
        }
      } else {
        update[key] = {};
        getCollapseAllUpdate(value, update[key]);
      }
    });
  }
  return update;
}

function collapseAllArrayItems(state, {meta}) {
  const uiPath = getUiPath(meta);
  const update = getCollapseAllUpdate(state.getIn(uiPath));
  return state.mergeDeepIn(uiPath, update);
}

function changeField(state, {meta, payload}) {
  return setIn(state, getDataPath(meta), fromJS(payload === '' ? undefined : payload));
}

function setUI(state, {meta, payload}) {
  return state.mergeIn(getUiPropertiesPath(meta), fromJS(payload));
}

function setDirty(dirty, path, isDirty) {
  const pathStr = pathToString(path);
  return isDirty ? dirty.add(pathStr) : dirty.remove(pathStr);
}

function checkIsDirty(state, meta) {
  const initialData = state.getIn(getInitialDataPath(meta));
  const currentData = state.getIn(getDataPath(meta));

  return isDirty(initialData, currentData);
}

function focusField(state, {meta}) {
  const fieldPath = pathToString(meta.path);
  return state.removeIn(['forms', meta.formName, 'errors', fieldPath]);
}

const bracketRegex = /\['|']\./g;

export function normalizeDataPath(dataPath) {
  // chop off leading . and replace bracket notion with . notation
  return dataPath.substr(1).replace(bracketRegex, '.');
}

function setTouched(state, {meta}) {
  return state.updateIn(['forms', meta.formName, 'touched'], touched =>
    (touched || emptySet).add(pathToString(meta.path))
  );
}

export function getIsNullObject(error, data, path) {
  return error.keyword === 'type' && error.params.type === 'object' && data.getIn(path.split(/\.|\[|\]\./)) === null;
}

export function getParentSchemaPath(error) {
  const parts = error.schemaPath.substr(2).split('/');
  const propertiesIndex = parts.lastIndexOf('properties');
  return parts.slice(0, propertiesIndex);
}

export function getIsRequired(schema, name) {
  const required = schema.get('required');

  // required may be undefined
  return required && required.find(prop => prop === name);
}

export function getName(path) {
  return path.split('.').pop();
}

function validate(state, {meta}) {
  const submitted = state.getIn(['forms', meta.formName, 'submitted']);
  const touched = state.getIn(['forms', meta.formName, 'touched'], emptySet);

  const errors = {};
  const schema = state.getIn(getSchemaPath(meta));
  if (schema) {
    const validate = compile(schema);
    const data = state.getIn(['forms', meta.formName, 'data']);
    const valid = validate(toJS(data));
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
            if (getIsRequired(schema.getIn(parentPath), getName(path))) {
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

  // Check to see if the last touched field is dirty
  let dirty = state.getIn(['forms', meta.formName, 'dirty'], emptySet);
  if (meta.path) {
    dirty = setDirty(dirty, meta.path, checkIsDirty(state, meta));
  }

  return state.mergeIn(['forms', meta.formName], {
    errors: Map(errors),
    dirty
  });
}

function submitForm(state, {meta}) {
  return state.mergeIn(['forms', meta.formName], {
    submitErrors: emptyMap,
    submitted: true
  });
}

function submitFormSuccess(state, {meta}) {
  return state.mergeIn(['forms', meta.formName], {
    dirty: emptySet,
    touched: emptySet,
    structuralChanges: emptyMap
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
