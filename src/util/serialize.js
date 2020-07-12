function serializerFactory() {
  const transform = (schema, data) => {
    if (data === null || data === undefined) {
      return data;
    }

    const type = schema.type;
    if (type === 'object') {
      if (schema.draftjs) {
        return null;
      }

      const properties = schema.properties;
      if (properties) {
        const result = {};
        for (const name of Object.keys(properties)) {
          const propSchema = properties[name];
          const value = data[name];
          if (value !== undefined) {
            result[name] = transform(propSchema, value);
          }
        }
        return result;
      }
      return data;
    }
    if (type === 'array') {
      const items = schema.items;
      if (items) {
        return data.map(item => transform(items, item));
      }
    }

    return data;
  };

  return transform;
}

export const serialize = serializerFactory();
