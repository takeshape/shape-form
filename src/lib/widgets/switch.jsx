import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import Switch from 'react-toolbox/lib/switch';
import theme from './widget.scss';
import FieldInfo from '../field-info';

export default class SwitchWidgets extends PureComponent {
  static propTypes = {
    value: PropTypes.any.isRequired,
    schema: PropTypes.object.isRequired,
    config: PropTypes.object,
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

    const enabled = typeof value === 'boolean' ? value : schema.get('default', false);
    const description = schema && schema.get('description');
    const instructions = config && config.get('instructions');

    return (
      <div className={theme.widget}>
        <Switch
          onChange={this.handleChange}
          checked={enabled}
          label={schema.get('title')}
          theme={theme}
          disabled={disabled}
        />

        <FieldInfo description={description} instructions={instructions} />
      </div>
    );
  }
}
