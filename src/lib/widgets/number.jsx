import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {Input} from 'react-toolbox/lib/input';
import theme from './widget.scss';
import FieldInfo from '../field-info';

export default class NumberWidget extends PureComponent {
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

  handleChange = value => {
    this.props.onChange(value === '' ? undefined : Number(value));
    this.props.onBlur();
  };

  render() {
    const {schema, config, value, error, isRequired, onBlur, disabled} = this.props;
    const inputProps = {value, error, required: isRequired, onChange: this.handleChange, onBlur, disabled};
    const description = schema && schema.get('description');
    const instructions = config && config.get('instructions');

    const multipleOf = schema.get('multipleOf');
    if (multipleOf) {
      inputProps.step = multipleOf;
    }
    const minimum = schema.get('minimum');
    if (minimum !== undefined) {
      inputProps.min = minimum;
    }

    const maximum = schema.get('maximum');
    if (maximum !== undefined) {
      inputProps.max = maximum;
    }

    return (
      <div className={theme.widget}>
        <Input {...inputProps} type="number" label={schema.get('title')} theme={theme} />
        <FieldInfo description={description} instructions={instructions} />
      </div>
    );
  }
}
