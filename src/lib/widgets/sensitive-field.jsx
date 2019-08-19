import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import SensitiveFieldInput from '../sensitive-field';
import theme from './widget.scss';
import FieldInfo from '../field-info';

export default class PasswordInputWidget extends PureComponent {
  static propTypes = {
    value: PropTypes.any.isRequired,
    error: PropTypes.string,
    isRequired: PropTypes.bool,
    schema: PropTypes.object.isRequired,
    config: PropTypes.object,
    context: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    disabled: PropTypes.bool
  };

  render() {
    const {schema, config, value, error, isRequired, onChange, onBlur, disabled} = this.props;
    const inputProps = {value, error, isRequired, onChange, onBlur, disabled};

    const maxLength = schema.get('maxLength');
    const description = schema.get('description');
    const instructions = config.get('instructions');

    if (maxLength) {
      inputProps.maxLength = maxLength;
    }

    return (
      <div className={theme.widget}>
        <SensitiveFieldInput
          {...inputProps}
          label={schema.get('title')}
          multiline={config && config.get('multiline')}
        />
        <FieldInfo description={description} instructions={instructions} />
      </div>
    );
  }
}
