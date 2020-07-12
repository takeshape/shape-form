import PropTypes from 'prop-types';
import React, {Fragment, PureComponent} from 'react';
import SchemaField from '../schema-field';
import ObjectFieldWrapper from './object-field-wrapper';
import get from 'lodash/get';

const nope = () => false;

function getPropIsRequired(required) {
  if (!required) {
    return nope;
  }

  const requiredSet = new Set(required);
  return name => requiredSet.has(name);
}

export default class ObjectField extends PureComponent {
  static propTypes = {
    schema: PropTypes.object.isRequired,
    formName: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired,
    context: PropTypes.object,
    widgets: PropTypes.object,
    isRequired: PropTypes.bool,
    disabled: PropTypes.bool,
    locale: PropTypes.string
  };

  render() {
    const {schema, formName, path, config, context, widgets, disabled, locale} = this.props;

    const properties = schema.properties;
    const names = config.order || Object.keys(properties);
    const isPropRequired = getPropIsRequired(schema.required);
    const title = schema.title;

    if (!names.length) {
      const EmptyObject = widgets && widgets.emptyObject;
      if (EmptyObject) {
        return (
          <EmptyObject
            schema={schema}
            formName={formName}
            path={path}
            config={config}
            context={context}
            widgets={widgets}
            disabled={disabled}
            locale={locale}
          />
        );
      }
    }

    const fields = names.map(name => {
      const propertySchema = properties[name];
      if (!propertySchema) {
        return null;
      }

      const propertyConfig = get(config, ['properties', name], {});
      return (
        <SchemaField
          key={name}
          schema={propertySchema}
          formName={formName}
          path={path ? `${path}.${name}` : name}
          isRequired={isPropRequired(name)}
          config={propertyConfig}
          context={context}
          widgets={widgets}
          disabled={disabled}
          locale={locale}
        />
      );
    });

    const Wrapper = (widgets && widgets[config.wrapper]) || (title ? ObjectFieldWrapper : Fragment);
    const wrapperProps = Wrapper === Fragment ? {} : this.props;

    return <Wrapper {...wrapperProps}>{fields}</Wrapper>;
  }
}
