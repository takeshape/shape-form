import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import Input from 'react-toolbox/lib/input';
import Dropdown from 'react-toolbox/lib/dropdown';
import Checkbox from 'react-toolbox/lib/checkbox';

const TYPE_MAPPING = {
  string: 'text',
  number: 'number',
  integer: 'number'
};

export default class DefaultWidget extends PureComponent {
  static propTypes = {
    value: PropTypes.any.isRequired,
    isRequired: PropTypes.bool,
    error: PropTypes.string,
    schema: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    disabled: PropTypes.bool
  };

  handleChange = value => {
    const {schema, onChange} = this.props;
    const type = schema.get('type');
    if (type === 'number' || type === 'integer') {
      onChange(value === '' ? undefined : Number(value));
    } else {
      onChange(value);
    }
  };

  render() {
    const {schema, value, error, onBlur, isRequired, disabled} = this.props;
    let InputComponent;
    const inputProps = {
      onChange: this.handleChange,
      onBlur,
      required: isRequired,
      label: schema.get('title'),
      disabled
    };

    const type = schema.get('type');
    const options = schema.get('enum');
    if (options) {
      InputComponent = Dropdown;
      inputProps.source = options.map(value => ({label: String(value), value})).toArray();
      inputProps.value = value;
    } else if (type === 'boolean') {
      InputComponent = Checkbox;
      inputProps.checked = Boolean(value);
    } else {
      InputComponent = Input;
      inputProps.type = TYPE_MAPPING[type];
      inputProps.value = value;
      inputProps.error = error;
    }

    return <InputComponent {...inputProps} />;
  }
}
