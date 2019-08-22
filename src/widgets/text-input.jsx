import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import TextField from '@material-ui/core/TextField';

export default class TextInputWidget extends PureComponent {
  static propTypes = {
    value: PropTypes.any.isRequired,
    error: PropTypes.string,
    isRequired: PropTypes.bool,
    schema: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    multiline: PropTypes.bool,
    disabled: PropTypes.bool
  };

  handleChange = event => {
    const {value} = event.target;
    this.props.onChange(value);
  };

  render() {
    const {schema, config, value, error, isRequired, multiline, onBlur, onFocus, disabled} = this.props;

    const maxLength = schema.get('maxLength');
    const description = schema.get('description');
    const instructions = config.get('instructions');
    const title = schema.get('title');
    const type = schema.get('type');
    const autoFocus = config.get('autoFocus', false);

    return (
      <TextField
        fullWidth
        label={title}
        error={Boolean(error)}
        helperText={error || instructions || description}
        margin="normal"
        value={value}
        onChange={this.handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        multiline={multiline}
        type={type}
        autoFocus={autoFocus}
        required={isRequired}
        maxLength={maxLength}
      />
    );
  }
}
