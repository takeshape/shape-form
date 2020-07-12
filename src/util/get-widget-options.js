import get from 'lodash/get';

export default function getWidgetOptions(schema, config) {
  let options = [];

  const configuredOptions = config.options;
  const sharedNameValueEnum = schema.enum;
  if (configuredOptions) {
    options = configuredOptions;
  } else if (sharedNameValueEnum) {
    options = sharedNameValueEnum.map(tzName => ({
      label: tzName,
      value: tzName
    }));
  } else {
    const oneOf = schema.type === 'array' ? get(schema, ['items', 'oneOf']) : schema.oneOf;
    if (oneOf) {
      options = oneOf.map(optionSchema => ({
        label: optionSchema.title,
        value: get(optionSchema, ['enum', 0])
      }));
    }
  }
  return options;
}
