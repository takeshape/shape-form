import PropTypes from 'prop-types';
import React, {Fragment, PureComponent} from 'react';
import SchemaField from '../schema-field';
import ObjectFieldWrapper from './object-field-wrapper';
import {Map} from 'immutable';

const nope = () => false;
const emptyMap = Map();

function getPropIsRequired(required) {
  if (!required) {
    return nope;
  }

  const requiredSet = required.toSet();
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

    const properties = schema.get('properties');
    const names = (config.get('order') || properties.keySeq()).toArray();
    const isPropRequired = getPropIsRequired(schema.get('required'));
    const title = schema.get('title');

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
      const propertySchema = properties.get(name);
      if (!propertySchema) {
        return null;
      }

      const propertyConfig = config.getIn(['properties', name], emptyMap);
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

    const Wrapper = (widgets && widgets[config.get('wrapper')]) || (title ? ObjectFieldWrapper : Fragment);
    const wrapperProps = Wrapper === Fragment ? {} : this.props;

    return <Wrapper {...wrapperProps}>{fields}</Wrapper>;
  }
}
