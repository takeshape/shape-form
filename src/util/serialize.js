import {Map, List, Iterable, fromJS} from 'immutable';

function serializerFactory() {
  const transform = (schema, data, toPojo = false) => {
    if (data === null || data === undefined) {
      return data;
    }

    const type = schema.get('type');
    if (type === 'object') {
      if (schema.get('draftjs')) {
        return null;
      }

      const fromImmutable = Iterable.isIterable(data);
      const properties = schema.get('properties');
      if (properties) {
        const result = {};
        properties.forEach((propSchema, name) => {
          const value = fromImmutable ? data.get(name) : data[name];
          if (value !== undefined) {
            result[name] = transform(propSchema, value, toPojo);
          }
        });

        return toPojo ? result : Map(result);
      }
      if (fromImmutable) {
        return toPojo ? data.toJS() : data;
      }
      return toPojo ? data : fromJS(data);
    }
    if (type === 'array') {
      const items = schema.get('items');
      if (items) {
        const mapped = data.map(item => transform(items, item, toPojo));
        if (Iterable.isIterable(data)) {
          return toPojo ? mapped.toArray() : mapped;
        }

        return toPojo ? mapped : List(mapped);
      }
    }

    return data;
  };

  return transform;
}

export const serialize = serializerFactory();
export const deserialize = serializerFactory();

export function toPojo(obj, transform) {
  const convert = obj => {
    if (Iterable.isKeyed(obj)) {
      return obj
        .toSeq()
        .map(convert)
        .toObject();
    }

    if (Iterable.isIndexed(obj)) {
      return obj
        .toSeq()
        .map(convert)
        .toArray();
    }

    return transform ? transform(obj) : obj;
  };

  return convert(obj);
}
