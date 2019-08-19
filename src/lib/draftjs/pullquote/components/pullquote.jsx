import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import styles from '../styles.scss';

export default class Pullquote extends PureComponent {
  static propTypes = {
    children: PropTypes.any
  };

  render() {
    return <aside className={styles.pullquote}>{this.props.children}</aside>;
  }
}
