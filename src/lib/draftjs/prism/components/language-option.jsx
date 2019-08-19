import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styles from '../styles/code-block-wrapper.scss';

export default class LanguageOption extends Component {
  static propTypes = {
    changeLang: PropTypes.any,
    lang: PropTypes.string,
    active: PropTypes.bool,
    value: PropTypes.string,
    label: PropTypes.string
  };

  handleClick = () => {
    const {changeLang, value} = this.props;
    changeLang(value);
  };

  render() {
    const {active} = this.props;
    return (
      <div onClick={this.handleClick} className={styles.languageOption}>
        <span style={{color: active ? 'red' : ''}}>{this.props.label}</span>
      </div>
    );
  }
}
