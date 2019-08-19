import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import theme from './widget.scss';
import InfoTooltip from '../info-tooltip';
import Instructions from '../instructions';
import cx from 'classnames';

export function getWidgetProps(props) {
  const {className, error, schema, config, isRequired, disabled, actions, children, innerRef} = props;
  return {className, error, schema, config, isRequired, disabled, actions, children, innerRef};
}

export default class Widget extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    error: PropTypes.string,
    schema: PropTypes.object.isRequired,
    config: PropTypes.object,
    isRequired: PropTypes.bool,
    disabled: PropTypes.bool,
    actions: PropTypes.any,
    children: PropTypes.any,
    innerRef: PropTypes.func
  };

  render() {
    const {schema, config, error, isRequired, actions, children, disabled, innerRef} = this.props;
    const description = schema && schema.get('description');
    const instructions = config && config.get('instructions');

    const widgetClasses = cx(theme.widget, this.props.className, {
      [theme.disabled]: disabled
    });

    return (
      <div ref={innerRef} className={widgetClasses}>
        <header className={theme.header}>
          <h3 className={theme.title}>
            {schema.get('title')}
            {isRequired && <span className={theme.required}> *</span>}
          </h3>
          <div className={theme.actions}>
            {description && <InfoTooltip top text={description} />}
            {actions}
          </div>
          {instructions && <Instructions value={instructions} />}
        </header>

        {children}
        {error && <p className={theme.error}>{error}</p>}
      </div>
    );
  }
}
