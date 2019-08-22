import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/styles/withStyles';

export function getWidgetProps(props) {
  const {className, error, schema, config, isRequired, disabled, actions, children, innerRef} = props;
  return {className, error, schema, config, isRequired, disabled, actions, children, innerRef};
}

class Widget extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.shape({
      header: PropTypes.string,
      title: PropTypes.string,
      error: PropTypes.string
    }),
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
    const {classes, schema, config, error, isRequired, actions, children, innerRef, className} = this.props;
    const description = schema && schema.get('description');
    const instructions = config && config.get('instructions');

    return (
      <div ref={innerRef} className={className}>
        <header className={classes.header}>
          <Typography className={classes.title}>
            {schema.get('title')}
            {isRequired && <span> *</span>}
          </Typography>
          <div>
            {description}
            {actions}
          </div>
          {instructions}
        </header>
        {children}
        {error && (
          <Typography variant="caption" className={classes.error}>
            {error}
          </Typography>
        )}
      </div>
    );
  }
}

const styles = {
  header: {
    marginBottom: '0.4rem',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  title: {
    fontSize: '1.6rem',
    lineHeight: 1,
    display: 'flex'
  },
  error: {
    color: 'red'
  }
};

export default withStyles(styles)(Widget);
