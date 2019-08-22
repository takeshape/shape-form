import {Map} from 'immutable';
import {createSelector} from 'reselect';
import toPath from 'lodash/toPath';
import {NAME} from './constants';
import {getFormPath, PROPERTIES} from './paths';
import {flattenStructuralChanges} from './util/structural-changes';
import {setIn} from './util/immutable-util';
import {serialize} from './util/serialize';

const emptyMap = Map();
const getState = state => state[NAME];
const getPath = (_, {path}) => path;
const getOnlyDirty = (_, {onlyDirty}) => onlyDirty;
const getSchemaRef = (_, {schemaRef}) => schemaRef;

export const getForm = (state, {selector, formName}) => {
  const rootSelector = selector || getState;
  return rootSelector(state).getIn(getFormPath(formName));
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
        return form.getIn(['schema'].concat(path));
      }

      return null;
    }
  );
};

export const getData = createSelector(
  [getForm, getPath],
  (form, path) => form && form.getIn(['data'].concat(toPath(path)))
);

export const getValues = createSelector(
  [getForm, getOnlyDirty],
  (form, onlyDirty) => {
    let data = form.get('data');

    if (onlyDirty) {
      const dirty = form.get('dirty');
      data = Map().withMutations(mutable => {
        // copy dirty array properties
        dirty.forEach(pathStr => {
          const path = toPath(pathStr);
          const isArrayPath = pathStr.includes('[');
          const prop = path[0];
          if (isArrayPath && !mutable.has(prop)) {
            mutable.set(prop, data.get(prop));
          }
        });
        // copy dirty properties and replace undefined values with a sentinel null value
        dirty.forEach(pathStr => {
          const path = toPath(pathStr);
          const value = data.getIn(path);
          setIn(mutable, path, value === undefined ? null : value);
        });
      });
    }

    return serialize(form.get('schema'), data, true);
  }
);

export const getUi = createSelector(
  [getForm, getPath],
  (form, path) => form.getIn(['ui'].concat(toPath(path), [PROPERTIES]))
);

const getErrors = createSelector(
  [getForm],
  form => form.get('errors', emptyMap)
);

const getSubmitErrors = createSelector(
  [getForm],
  form => form.get('submitErrors', emptyMap)
);

const getError = createSelector(
  [getErrors, getSubmitErrors, getPath],
  (errors, submitErrors, path) => submitErrors.get(path) || errors.get(path)
);

export const getDirty = createSelector(
  [getForm],
  form => form && form.get('dirty')
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
    const structuralChanges = form.get('structuralChanges');
    if (!structuralChanges) {
      return [];
    }

    const result = [];
    const path = [];
    return flattenStructuralChanges(structuralChanges, path, result);
  }
);
