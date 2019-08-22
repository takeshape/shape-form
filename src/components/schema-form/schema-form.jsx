import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {Map, fromJS} from 'immutable';

import dnd from '../../dnd';
import SchemaField from '../schema-field';

const emptyMap = Map();

export const FormContext = React.createContext();

class SchemaForm extends PureComponent {
  static propTypes = {
    formName: PropTypes.string.isRequired,
    registerForm: PropTypes.func.isRequired,
    submitForm: PropTypes.func.isRequired,
    clearForm: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    schema: PropTypes.object,
    schemaRef: PropTypes.string,
    registeredSchema: PropTypes.object,
    initialData: PropTypes.object,
    basePath: PropTypes.string,
    config: PropTypes.object,
    context: PropTypes.object,
    widgets: PropTypes.object,
    partial: PropTypes.bool,
    children: PropTypes.any,
    version: PropTypes.any,
    disabled: PropTypes.bool,
    locale: PropTypes.string
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.submitForm(this.props.formName, this.props.onSubmit);
  };

  componentDidMount() {
    const {formName, initialData, schema, registerForm} = this.props;
    if (schema) {
      registerForm(formName, fromJS(schema), fromJS(initialData || {}));
    }
  }

  componentDidUpdate(prevProps) {
    const {registerForm, version, schema, formName, initialData} = this.props;

    if ((prevProps.version !== version || prevProps.schema !== schema) && (initialData || schema)) {
      registerForm(formName, fromJS(schema), fromJS(initialData));
    }
  }

  componentWillUnmount() {
    if (!this.props.partial) {
      this.props.clearForm(this.props.formName);
    }
  }

  render() {
    const {registeredSchema, formName, basePath, config, context, widgets, children, disabled, locale} = this.props;

    let rootField = null;

    if (registeredSchema) {
      rootField = (
        <FormContext.Provider value={{locale}}>
          <SchemaField
            schema={registeredSchema}
            formName={formName}
            path={basePath || ''}
            config={fromJS(config) || emptyMap}
            context={context}
            widgets={widgets}
            disabled={disabled}
            locale={locale}
          />
        </FormContext.Provider>
      );
    }

    if (children) {
      return (
        <form onSubmit={this.handleSubmit} noValidate>
          {rootField}
          {children}
        </form>
      );
    }

    return rootField;
  }
}

export default dnd(SchemaForm);
