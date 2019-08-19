import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import dropTarget from '../../decorators/drop-target';

class ArrayFieldDropTarget extends PureComponent {
  static propTypes = {
    count: PropTypes.number.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    className: PropTypes.string,
    children: PropTypes.any
  };

  setDomNode = node => {
    this.domNode = node;
  };

  render() {
    const {connectDropTarget, className, children} = this.props;

    return connectDropTarget(
      <ul ref={this.setDomNode} className={className}>
        {children}
      </ul>
    );
  }
}

export default dropTarget(ArrayFieldDropTarget);
