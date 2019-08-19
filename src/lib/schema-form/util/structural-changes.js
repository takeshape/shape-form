import {Map, Range} from 'immutable';
import {pathToString, PROPERTIES} from '../paths';

function visitProps(schema, data, callback, path = []) {
  callback(schema, data, path);
  if (data === null || data === undefined) {
    return;
  }

  const type = schema.get('type');
  if (type === 'object') {
    const properties = schema.get('properties');
    if (properties) {
      properties.forEach((propSchema, name) => {
        const value = data.get(name);
        if (value !== undefined) {
          visitProps(propSchema, value, callback, path.concat(name));
        }
      });
    }
  } else if (type === 'array') {
    const itemSchema = schema.get('items');
    if (itemSchema) {
      return data.map((item, i) => visitProps(itemSchema, item, callback, path.concat(i)));
    }
  }
}

function initStructuralChangeProps(initialValue) {
  const size = initialValue.size;
  return Map({
    arrayKeys: Range(0, size).toList(),
    nextKey: size,
    originalSize: size
  });
}

export function initStructuralChanges(schema, initialData) {
  return Map().withMutations(result => {
    visitProps(schema, initialData, (schema, data, path) => {
      if (schema.get('type') === 'array') {
        result.setIn(path.concat(PROPERTIES), initStructuralChangeProps(data));
      }
    });
  });
}

function wasStructureModified(indicies, originalSize) {
  if (indicies.size !== originalSize) {
    return true;
  }
  for (let i = 0; i < indicies.size; i++) {
    if (indicies.get(i) !== i) {
      return true;
    }
  }
  return false;
}

export function flattenStructuralChanges(changes, path = [], result = []) {
  const props = changes.get(PROPERTIES);
  if (props) {
    const arrayKeys = props.get('arrayKeys');
    const originalSize = props.get('originalSize');

    if (wasStructureModified(arrayKeys, originalSize)) {
      result.push({path: pathToString(path), structure: arrayKeys.toArray()});
    }
  }
  changes.forEach((change, key) => {
    if (key !== PROPERTIES) {
      flattenStructuralChanges(change, path.concat(key), result);
    }
  });

  return result;
}
