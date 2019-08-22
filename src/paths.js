import {Map} from 'immutable';
import mapValues from 'lodash/mapValues';
import isNaN from 'lodash/isNaN';

const emptyMap = Map();

export function getFormPath(formName) {
  return ['forms', formName];
}
export function getDataPath({formName, path}) {
  return ['forms', formName, 'data'].concat(path);
}
export function getInitialDataPath({formName, path}) {
  return ['forms', formName, 'initialData'].concat(path);
}

export function getSchemaPath({formName}) {
  return ['forms', formName, 'schema'];
}

export function getUiPath({formName, path}) {
  if (path) {
    return ['forms', formName, 'ui'].concat(path);
  }

  return ['forms', formName, 'ui'];
}

export const PROPERTIES = '__properties';

export function getUiPropertiesPath({formName, path}) {
  return ['forms', formName, 'ui'].concat(path, [PROPERTIES]);
}

export function getCollapsedPath({formName, path}) {
  return ['forms', formName, 'ui'].concat(path, [PROPERTIES, 'collapsed']);
}

export function getPlaceholderPath({formName, path}) {
  return ['forms', formName, 'ui'].concat(path, [PROPERTIES, 'placeholder']);
}

export function getKeysPath({formName, path}) {
  return ['forms', formName, 'ui'].concat(path, [PROPERTIES, 'arrayKeys']);
}

export function getStructuralChangesPath({formName, path}) {
  return ['forms', formName, 'structuralChanges'].concat(path);
}

export function getForm(state, formName) {
  return state.getIn(['forms', formName]);
}

function applyPlugins(state, plugins, action, prevState) {
  const update = mapValues(plugins, (pluginReducer, formName) => {
    const formState = getForm(state, formName);
    const prevFormState = getForm(prevState, formName);
    return pluginReducer(formState, action, prevFormState);
  });
  return state.mergeIn(['forms'], update);
}

export function reducerFactory(initialState, baseReducers) {
  return plugins => {
    if (plugins) {
      initialState = applyPlugins(initialState, plugins, {}, emptyMap);
    }

    return (state = initialState, action) => {
      const newState = baseReducers[action.type] ? baseReducers[action.type](state, action) : state;

      if (plugins) {
        return applyPlugins(newState, plugins, action, state);
      }

      return newState;
    };
  };
}

export function matches(path, names) {
  const namesLength = names.length;
  const pathLength = path.length;

  if (pathLength < namesLength) {
    return false;
  }

  let i = pathLength - namesLength;
  let j = 0;

  for (; j < namesLength; i++, j++) {
    if (path[i] !== names[j]) {
      return false;
    }
  }
  return true;
}

export function pathToString(array) {
  return array.reduce((string, item) => {
    const prefix = string === '' ? '' : '.';
    return string + (isNaN(Number(item)) ? `${prefix}${item}` : `[${item}]`);
  }, '');
}
