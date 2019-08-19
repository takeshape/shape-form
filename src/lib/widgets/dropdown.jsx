import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import Dropdown from 'react-toolbox/lib/dropdown';
import coerceValue from '../../utils/coerce-value';
import getWidgetOptions from '../../utils/get-widget-options';
import widgetTheme from './widget.scss';
import theme from './dropdown.scss';
import FieldInfo from '../field-info';

export default class DropdownWidget extends PureComponent {
  static propTypes = {
    value: PropTypes.any.isRequired,
    error: PropTypes.string,
    isRequired: PropTypes.bool,
    schema: PropTypes.object.isRequired,
    config: PropTypes.object,
    widgets: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    disabled: PropTypes.bool
  };

  handleChange = newValue => {
    const {onChange, onBlur, schema} = this.props;
    onChange(coerceValue(schema, newValue));
    onBlur();
  };

  getItemTemplate = () => {
    const {widgets, config} = this.props;
    return widgets && config && widgets[config.get('itemTemplate')];
  };

  renderItemTemplate = props => {
    const Template = this.getItemTemplate();
    return <Template {...props} />;
  };

  render() {
    const {schema, config, value, error, isRequired, disabled} = this.props;
    const inputProps = {
      value,
      error,
      required: isRequired,
      disabled
    };

    const options = getWidgetOptions(schema, config);
    const description = schema && schema.get('description');
    const instructions = config && config.get('instructions');
    const template = this.getItemTemplate() ? this.renderItemTemplate : undefined;
    const allowBlank = config && config.get('allowBlank');

    return (
      <div className={widgetTheme.widget}>
        <Dropdown
          {...inputProps}
          allowBlank={allowBlank}
          label={schema.get('title')}
          onChange={this.handleChange}
          template={template}
          source={options}
          theme={theme}
        />
        <FieldInfo description={description} instructions={instructions} />
      </div>
    );
  }
}
