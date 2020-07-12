import {createSelector} from 'reselect';
import get from 'lodash/get';
import toPath from 'lodash/toPath';
import {NAME} from './constants';
import {getFormPath, PROPERTIES} from './paths';
import {flattenStructuralChanges} from './util/structural-changes';
import {setIn} from './util/immutable-util';
import {serialize} from './util/serialize';

const getState = state => state[NAME];
const getPath = (_, {path}) => path;
const getOnlyDirty = (_, {onlyDirty}) => onlyDirty;
const getSchemaRef = (_, {schemaRef}) => schemaRef;

export const getForm = (state, {selector, formName}) => {
  const rootSelector = selector || getState;
  return get(rootSelector(state), getFormPath(formName));
};

function parseRef(ref) {
  const parts = ref ? ref.split('/') : [];
  return parts[0] === '#' ? parts.splice(1) : parts;
}

export const makeSchemaSelector = () => {
  return createSelector(
    [getForm, getSchemaRef],
    (form, schemaRef) => {
      if (form) {
        const path = parseRef(schemaRef);
        return get(form, ['schema'].concat(path));
      }

      return null;
    }
  );
};

export const getData = createSelector(
  [getForm, getPath],
  (form, path) => form && get(form, ['data'].concat(toPath(path)))
);

export const getValues = createSelector(
  [getForm, getOnlyDirty],
  (form, onlyDirty) => {
    let data = form.data;

    if (onlyDirty) {
      const dirty = form.dirty;
      const dirtyData = {};
      // copy dirty array properties
      dirty.forEach(pathStr => {
        const path = toPath(pathStr);
        const isArrayPath = pathStr.includes('[');
        const prop = path[0];
        if (isArrayPath && !dirtyData[prop]) {
          dirtyData[prop] = data[prop];
        }
      });
      // copy dirty properties and replace undefined values with a sentinel null value
      dirty.forEach(pathStr => {
        const path = toPath(pathStr);
        const value = get(data, path);
        setIn(dirtyData, path, value === undefined ? null : value);
      });

      data = dirtyData;
    }

    return serialize(form.schema, data);
  }
);

export const getUi = createSelector(
  [getForm, getPath],
  (form, path) => get(form, ['ui'].concat(toPath(path), [PROPERTIES]))
);

const getErrors = createSelector(
  [getForm],
  form => form.errors || {}
);

const getSubmitErrors = createSelector(
  [getForm],
  form => form.submitErrors || {}
);

const getError = createSelector(
  [getErrors, getSubmitErrors, getPath],
  (errors, submitErrors, path) => submitErrors[path] || errors[path]
);

export const getDirty = createSelector(
  [getForm],
  form => form && form.dirty
);

export const makeValueSelector = () => {
  return createSelector(
    [getData, getUi, getError],
    (value, ui, error) => ({
      value: value === undefined || value === null ? '' : value,
      ui,
      error
    })
  );
};

export const makeArrayLengthSelector = () => {
  return createSelector(
    getData,
    data => (data ? data.size : 0)
  );
};

export const getStructuralChanges = createSelector(
  [getForm],
  form => {
    const structuralChanges = form.structuralChanges;
    if (!structuralChanges) {
      return [];
    }

    const result = [];
    const path = [];
    return flattenStructuralChanges(structuralChanges, path, result);
  }
);
