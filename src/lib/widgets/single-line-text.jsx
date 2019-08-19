import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import Input from 'react-toolbox/lib/input';
import theme from './widget.scss';
import FieldInfo from '../field-info';

export default class SingleLineTextWidget extends PureComponent {
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

  render() {
    const {schema, config, value, error, isRequired, multiline, onChange, onBlur, disabled} = this.props;
    const inputProps = {value, error, required: isRequired, multiline, onChange, onBlur, disabled};

    const maxLength = schema.get('maxLength');
    const description = schema.get('description');
    const instructions = config.get('instructions');

    if (maxLength) {
      inputProps.maxLength = maxLength;
    }

    return (
      <div className={theme.widget}>
        <Input {...inputProps} label={schema.get('title')} theme={theme} autoFocus={config.get('autoFocus', false)} />
        <FieldInfo description={description} instructions={instructions} />
      </div>
    );
  }
}
