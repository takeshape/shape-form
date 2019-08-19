import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {RadioButton, RadioGroup} from 'react-toolbox/lib/radio';
import getWidgetOptions from '../../utils/get-widget-options';
import Widget from './widget';

export default class SelectWidget extends PureComponent {
  static propTypes = {
    value: PropTypes.any.isRequired,
    error: PropTypes.string,
    schema: PropTypes.object.isRequired,
    config: PropTypes.object,
    isRequired: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    disabled: PropTypes.bool
  };

  handleChange = payload => {
    const {onChange, onBlur} = this.props;
    // this is to ensure blur fires after change to correctly set dirty fields in the state
    onChange(payload);
    onBlur();
  };

  render() {
    const {schema, config, value, disabled} = this.props;
    const options = getWidgetOptions(schema, config);

    return (
      <Widget {...this.props}>
        <RadioGroup value={value} onChange={this.handleChange} disabled={disabled}>
          {options.map(option => (
            <RadioButton key={option.value} label={option.label} value={option.value} disabled={disabled} />
          ))}
        </RadioGroup>
      </Widget>
    );
  }
}
