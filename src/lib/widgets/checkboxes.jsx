import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import Checkbox from 'react-toolbox/lib/checkbox';
import getWidgetOptions from '../../utils/get-widget-options';
import {List} from 'immutable';
import style from './checkboxes.scss';
import theme from './widget.scss';
import FieldInfo from '../field-info';

const emptyList = List();

export default class Checkboxes extends PureComponent {
  static propTypes = {
    value: PropTypes.any,
    error: PropTypes.string,
    isRequired: PropTypes.bool,
    schema: PropTypes.object.isRequired,
    config: PropTypes.object,
    options: PropTypes.array,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    disabled: PropTypes.bool
  };

  getChecked = () => this.props.value || emptyList;

  handleChange = (isChecked, event) => {
    const {onChange, onBlur} = this.props;
    if (onChange) {
      const {value} = event.target;
      const checked = this.getChecked();
      const alreadyChecked = checked.contains(value);

      if (isChecked && !alreadyChecked) {
        onChange(checked.push(value));
      } else if (!isChecked && alreadyChecked) {
        onChange(checked.filter(currentValue => currentValue !== value));
      }
    }
    // this is to ensure blur fires after change to correctly set dirty fields in the state
    if (onBlur) {
      onBlur();
    }
  };

  render() {
    const {schema, config, error, disabled} = this.props;
    const checked = this.getChecked();

    const options = this.props.options || getWidgetOptions(schema, config);
    const description = schema && schema.get('description');
    const instructions = config && config.get('instructions');

    return (
      <div className={theme.widget}>
        <h3 className={style.title}>{schema.get('title')}</h3>
        {options.map(option => {
          const value = option.value;
          return (
            <Checkbox
              key={value}
              checked={checked.contains(value)}
              label={option.label}
              value={value}
              onChange={this.handleChange}
              disabled={disabled}
            />
          );
        })}
        <div className={style.error}>{error}</div>
        <FieldInfo description={description} instructions={instructions} />
      </div>
    );
  }
}
