import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import DefaultWidget from '../default-widget';

export default class ScalarField extends PureComponent {
  static propTypes = {
    value: PropTypes.any.isRequired,
    ui: PropTypes.object,
    error: PropTypes.string,
    schema: PropTypes.object.isRequired,
    formName: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    isRequired: PropTypes.bool,
    config: PropTypes.object.isRequired,
    context: PropTypes.object,
    widgets: PropTypes.object,
    disabled: PropTypes.bool,
    locale: PropTypes.string,

    onChange: PropTypes.func.isRequired,
    onChangeSilent: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    setUI: PropTypes.func.isRequired
  };

  render() {
    const {
      formName,
      path,
      schema,
      value,
      ui,
      error,
      onChange,
      onChangeSilent,
      onBlur,
      onFocus,
      setUI,
      config,
      context,
      isRequired,
      widgets,
      disabled,
      locale
    } = this.props;

    const widgetProps = {
      formName,
      path,
      schema,
      value,
      ui,
      error,
      onChange,
      onChangeSilent,
      onBlur,
      onFocus,
      setUI,
      config,
      context,
      isRequired,
      widgets,
      disabled,
      locale
    };

    let Widget = DefaultWidget;

    if (widgets && config) {
      const widgetName = config.widget;
      if (widgets[widgetName]) {
        Widget = widgets[widgetName];
      }
    }

    return <Widget {...widgetProps} />;
  }
}
