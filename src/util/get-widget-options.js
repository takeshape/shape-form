export default function getWidgetOptions(schema, config) {
  let options = [];

  const configuredOptions = config.get('options');
  const sharedNameValueEnum = schema.get('enum');
  if (configuredOptions) {
    options = configuredOptions.toJS();
  } else if (sharedNameValueEnum) {
    options = sharedNameValueEnum.toArray().map(tzName => ({
      label: tzName,
      value: tzName
    }));
  } else {
    const oneOf = schema.get('type') === 'array' ? schema.getIn(['items', 'oneOf']) : schema.get('oneOf');
    if (oneOf) {
      options = oneOf.toArray().map(optionSchema => ({
        label: optionSchema.get('title'),
        value: optionSchema.getIn(['enum', 0])
      }));
    }
  }
  return options;
}
