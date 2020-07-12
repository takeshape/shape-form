import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

export default class CheckboxWidget extends PureComponent {
  static propTypes = {
    value: PropTypes.any.isRequired,
    error: PropTypes.string,
    schema: PropTypes.object.isRequired,
    config: PropTypes.object,
    path: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    isRequired: PropTypes.bool
  };

  // this is to ensure blur fires after change to correctly set dirty fields in the state
  handleChange = event => {
    this.props.onChange(event.target.checked);
    this.props.onBlur();
  };

  render() {
    const {value, schema, config, path, error} = this.props;

    const enabled = typeof value === 'boolean' ? value : schema.default || false;
    const title = schema.title;
    const description = schema.description;

    const instructions = config.instructions;
    const helperText = error || instructions || description;

    return (
      <div>
        <FormControlLabel
          control={<Checkbox checked={enabled} onChange={this.handleChange} value={path} color="primary" />}
          label={title}
        />
        {helperText && <Typography variant="caption">{helperText}</Typography>}
      </div>
    );
  }
}
