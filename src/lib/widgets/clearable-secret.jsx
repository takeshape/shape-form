import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import ClearableSecret from '../clearable-secret';
import theme from './widget.scss';
import FieldInfo from '../field-info';

export default class ClearableSecretWidget extends PureComponent {
  static propTypes = {
    value: PropTypes.any.isRequired,
    error: PropTypes.string,
    isRequired: PropTypes.bool,
    schema: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired
  };

  render() {
    const {schema, config, value, error, isRequired, onChange, onBlur} = this.props;
    const inputProps = {value, error, required: isRequired, onChange, onBlur};

    const description = schema.get('description');
    const instructions = config.get('instructions');

    return (
      <div className={theme.widget}>
        <ClearableSecret {...inputProps} label={schema.get('title')} theme={theme} />
        <FieldInfo description={description} instructions={instructions} />
      </div>
    );
  }
}
