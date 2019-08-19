import toPath from 'lodash/toPath';

import {
  SUBMIT_FORM,
  REGISTER_FORM,
  CLEAR_FORM,
  CHANGE_FIELD,
  FOCUS_FIELD,
  BLUR_FIELD,
  SET_UI,
  INIT_ARRAY,
  ADD_ARRAY_ITEM,
  REMOVE_ARRAY_ITEM,
  SWAP_ARRAY_ITEMS,
  TOGGLE_ARRAY_ITEM,
  INSERT_PLACEHOLDER,
  CLEAR_PLACEHOLDER,
  COLLAPSE_ALL_ARRAY_ITEMS,
  EXPAND_ALL_ARRAY_ITEMS,
  VALIDATE_FORM
} from './action-types';

export function bindMeta(formName, path) {
  return actionCreator => (...args) => {
    const action = actionCreator(...args);
    action.meta = action.meta || {};
    action.meta.formName = formName;
    action.meta.path = toPath(path);
    return action;
  };
}

export function changeField(formName, path, silent = false) {
  return value => ({
    type: CHANGE_FIELD,
    meta: {
      formName,
      path: toPath(path),
      silent
    },
    payload: value
  });
}

export function focusField(formName, path) {
  return {
    type: FOCUS_FIELD,
    meta: {
      formName,
      path: toPath(path)
    }
  };
}

export function blurField(formName, path) {
  return {
    type: BLUR_FIELD,
    meta: {
      formName,
      path: toPath(path)
    }
  };
}

export function setUI(formName, path, value) {
  return {
    type: SET_UI,
    meta: {
      formName,
      path: toPath(path)
    },
    payload: value
  };
}

export function swapArrayItems(indexA, indexB) {
  return {
    type: SWAP_ARRAY_ITEMS,
    meta: {
      indexA,
      indexB
    }
  };
}

export function removeArrayItem(index) {
  return {
    type: REMOVE_ARRAY_ITEM,
    meta: {
      index
    }
  };
}

export function addArrayItem(value, index) {
  return {
    type: ADD_ARRAY_ITEM,
    meta: {index},
    payload: value
  };
}

export function toggleArrayItem(key) {
  return {
    type: TOGGLE_ARRAY_ITEM,
    payload: key
  };
}
export function clearArrayItemPlaceholder() {
  return {
    type: CLEAR_PLACEHOLDER
  };
}

export function insertArrayItemPlaceholder(value, index) {
  return {
    type: INSERT_PLACEHOLDER,
    meta: {
      index
    },
    payload: value
  };
}

export function collapseAllArrayItems() {
  return {
    type: COLLAPSE_ALL_ARRAY_ITEMS
  };
}

export function expandAllArrayItems() {
  return {
    type: EXPAND_ALL_ARRAY_ITEMS
  };
}

export function initializeArray() {
  return {
    type: INIT_ARRAY
  };
}

export function registerForm(formName, schema, initialData, initialDirty) {
  return {
    type: REGISTER_FORM,
    meta: {
      formName
    },
    payload: {schema, initialData, initialDirty}
  };
}

export function clearForm(formName) {
  return {
    type: CLEAR_FORM,
    meta: {
      formName
    }
  };
}

export function submitForm(formName, callback, onlyDirty) {
  if (typeof formName === 'object') {
    const params = formName;
    return {
      type: SUBMIT_FORM,
      meta: {
        formName: params.formName,
        onlyDirty: params.onlyDirty,
        withValues: params.withValues
      },
      callback: params.callback
    };
  }
  return {
    type: SUBMIT_FORM,
    meta: {
      formName,
      onlyDirty
    },
    callback
  };
}

export function validateForm(formName) {
  return {
    type: VALIDATE_FORM,
    meta: {
      formName
    }
  };
}
