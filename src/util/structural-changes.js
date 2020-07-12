import {pathToString, PROPERTIES} from '../paths';
import range from 'lodash/range';
import set from 'lodash/set';

function visitProps(schema, data, callback, path = []) {
  callback(schema, data, path);
  if (data === null || data === undefined) {
    return;
  }

  const type = schema.type;
  if (type === 'object') {
    const properties = schema.properties;
    if (properties) {
      for (const name of Object.keys(properties)) {
        const propSchema = properties[name];
        const value = data[name];
        if (value !== undefined) {
          visitProps(propSchema, value, callback, path.concat(name));
        }
      }
    }
  } else if (type === 'array') {
    const itemSchema = schema.items;
    if (itemSchema) {
      return data.map((item, i) => visitProps(itemSchema, item, callback, path.concat(i)));
    }
  }
}

function initStructuralChangeProps(initialValue) {
  const size = initialValue.length;
  return {
    arrayKeys: range(size),
    nextKey: size,
    originalSize: size
  };
}

export function initStructuralChanges(schema, initialData) {
  const result = {};
  visitProps(schema, initialData, (schema, data, path) => {
    if (schema.type === 'array') {
      set(result, path.concat(PROPERTIES), initStructuralChangeProps(data));
    }
  });
  return result;
}

function wasStructureModified(indicies, originalSize) {
  if (indicies.length !== originalSize) {
    return true;
  }
  for (let i = 0; i < indicies.length; i++) {
    if (indicies[i] !== i) {
      return true;
    }
  }
  return false;
}

export function flattenStructuralChanges(changes, path = [], result = []) {
  const props = changes[PROPERTIES];
  if (props) {
    const arrayKeys = props.arrayKeys;
    const originalSize = props.originalSize;

    if (wasStructureModified(arrayKeys, originalSize)) {
      result.push({path: pathToString(path), structure: arrayKeys});
    }
  }
  for (const key of Object.keys(changes)) {
    if (key !== PROPERTIES) {
      flattenStructuralChanges(changes[key], path.concat(key), result);
    }
  }

  return result;
}
