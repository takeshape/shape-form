import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import PasswordInput from '../password-input';
import style from './password.scss';

export default class PasswordInputWidget extends PureComponent {
  static propTypes = {
    value: PropTypes.any.isRequired,
    error: PropTypes.string,
    isRequired: PropTypes.bool,
    schema: PropTypes.object.isRequired,
    config: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    disabled: PropTypes.bool
  };

  render() {
    const {schema, config, value, error, isRequired, onChange, onBlur, disabled} = this.props;
    const inputProps = {value, error, required: isRequired, onChange, onBlur, disabled};

    const maxLength = schema.get('maxLength');

    if (maxLength) {
      inputProps.maxLength = maxLength;
    }

    return (
      <div>
        <div className={style.container}>
          <PasswordInput {...inputProps} label={schema.get('title')} />
        </div>
        {config && config.get('instructions')}
      </div>
    );
  }
}
