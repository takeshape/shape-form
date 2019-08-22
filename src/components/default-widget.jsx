import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import TextInputWidget from '../widgets/text-input';
import SelectInputWidget from '../widgets/select-input';
import CheckboxWidget from '../widgets/checkbox';

const TYPE_MAPPING = {
  string: 'text',
  number: 'number',
  integer: 'number',
  boolean: 'checkbox'
};

export default class DefaultWidget extends PureComponent {
  static propTypes = {
    value: PropTypes.any.isRequired,
    isRequired: PropTypes.bool,
    error: PropTypes.string,
    config: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired,
    schema: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    disabled: PropTypes.bool
  };

  handleChange = value => {
    const {schema, onChange} = this.props;
    const type = schema.get('type');
    if (TYPE_MAPPING[type] === 'number') {
      onChange(value === '' ? undefined : Number(value));
    } else {
      onChange(value);
    }
  };

  render() {
    const {schema, config, value, error, onBlur, onFocus, isRequired, disabled, path} = this.props;
    let InputComponent = TextInputWidget;
    const inputProps = {
      onChange: this.handleChange,
      onBlur,
      onFocus,
      isRequired,
      disabled,
      path,
      schema,
      config,
      error,
      value
    };

    const type = schema.get('type');
    const options = schema.get('enum');
    if (options) {
      InputComponent = SelectInputWidget;
    } else if (type === 'boolean') {
      InputComponent = CheckboxWidget;
      inputProps.type = 'checkbox';
      inputProps.checked = Boolean(value);
    } else {
      inputProps.type = TYPE_MAPPING[type];
    }

    return <InputComponent {...inputProps} />;
  }
}
