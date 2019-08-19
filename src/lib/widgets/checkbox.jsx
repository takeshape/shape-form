import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {Checkbox} from 'react-toolbox/lib/checkbox';
import theme from './widget.scss';
import FieldInfo from '../field-info';

export default class CheckboxWidget extends PureComponent {
  static propTypes = {
    value: PropTypes.any.isRequired,
    error: PropTypes.string,
    schema: PropTypes.object.isRequired,
    config: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    disabled: PropTypes.bool
  };

  // this is to ensure blur fires after change to correctly set dirty fields in the state
  handleChange = payload => {
    this.props.onChange(payload);
    this.props.onBlur();
  };

  render() {
    const {value, schema, config, disabled} = this.props;
    const enabled = typeof value === 'boolean' ? value : schema.get('default', false);
    const description = schema && schema.get('description');
    const instructions = config && config.get('instructions');

    return (
      <div className={theme.widget}>
        <Checkbox
          label={schema.get('title')}
          checked={enabled}
          onChange={this.handleChange}
          theme={theme}
          disabled={disabled}
        />
        <FieldInfo description={description} instructions={instructions} />
      </div>
    );
  }
}
