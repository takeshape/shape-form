import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import ObjectField from './object-field';
import ArrayField from './array-field';
import ScalarField from './scalar-field';

export default class SchemaField extends PureComponent {
  static propTypes = {
    schema: PropTypes.object.isRequired,
    formName: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    isRequired: PropTypes.bool,
    config: PropTypes.object.isRequired,
    context: PropTypes.object,
    widgets: PropTypes.object,
    disabled: PropTypes.bool,
    locale: PropTypes.string
  };

  render() {
    const {schema, config, widgets} = this.props;
    const type = schema.type;

    let Component;
    if (config && widgets && widgets[config.widget]) {
      // handle custom widget
      Component = ScalarField;
    } else if (type === 'object') {
      Component = ObjectField;
    } else if (type === 'array') {
      Component = ArrayField;
    } else {
      Component = ScalarField;
    }

    return <Component {...this.props} />;
  }
}
