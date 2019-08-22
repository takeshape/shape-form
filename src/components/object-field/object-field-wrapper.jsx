import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';

export default class ObjectFieldWrapper extends PureComponent {
  static propTypes = {
    children: PropTypes.any
  };

  render() {
    const {children, ...rest} = this.props;
    return <div {...rest}>{children}</div>;
  }
}
