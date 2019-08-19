import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import theme from './object-field.scss';
import Widget from 'app/common/components/widgets/widget';

export default class ObjectFieldWrapper extends PureComponent {
  static propTypes = {
    children: PropTypes.any
  };

  render() {
    const {children, ...rest} = this.props;
    return (
      <Widget {...rest}>
        <div className={theme.objectWrapper}>{children}</div>
      </Widget>
    );
  }
}
