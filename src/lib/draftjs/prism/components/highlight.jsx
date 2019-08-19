import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styles from '../styles/prism.scss';

export default class Highlight extends Component {
  static propTypes = {
    type: PropTypes.string,
    decoratedText: PropTypes.string,
    children: PropTypes.any
  };

  shouldComponentUpdate(props) {
    const shouldUpdate = this.props.type !== props.type || this.props.decoratedText !== props.decoratedText;
    return shouldUpdate;
  }

  render() {
    const classes = `prism-token ${styles.token} ${styles[this.props.type]}`;
    return <span className={classes}>{this.props.children}</span>;
  }
}
