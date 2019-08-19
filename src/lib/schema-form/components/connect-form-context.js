/* eslint-disable react/display-name */
import React from 'react';
import {FormContext} from './schema-form';

export default function connectFormContext(Component) {
  return props => (
    <FormContext.Consumer>
      {formContext => {
        const propsWContext = {...props, formContext};
        return <Component {...propsWContext} />;
      }}
    </FormContext.Consumer>
  );
}
