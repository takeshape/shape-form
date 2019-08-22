import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import getWidgetOptions from '../util/get-widget-options';

export default class TextInputWidget extends PureComponent {
  static propTypes = {
    value: PropTypes.any.isRequired,
    error: PropTypes.string,
    isRequired: PropTypes.bool,
    schema: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    multiline: PropTypes.bool,
    disabled: PropTypes.bool
  };

  handleChange = event => {
    const {value} = event.target;
    this.props.onChange(value);
  };

  render() {
    const {schema, config, value, error, isRequired, onBlur, disabled} = this.props;

    const description = schema.get('description');
    const instructions = config.get('instructions');
    const type = schema.get('type');
    const title = schema.get('title');
    const autoFocus = config.get('autoFocus', false);
    const options = getWidgetOptions(schema, config);

    return (
      <TextField
        select
        fullWidth
        label={title}
        error={Boolean(error)}
        helperText={error || instructions || description}
        margin="normal"
        value={value}
        onChange={this.handleChange}
        onBlur={onBlur}
        disabled={disabled}
        type={type}
        autoFocus={autoFocus}
        required={isRequired}
      >
        {options &&
          options.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
      </TextField>
    );
  }
}
