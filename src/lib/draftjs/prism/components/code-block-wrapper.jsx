import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {EditorBlock} from 'draft-js';
import {IconMenu, MenuItem} from 'react-toolbox/lib/menu';
import LanguageOption from './language-option';
import styles from '../styles/code-block-wrapper.scss';

const options = [
  {label: 'JavaScript', value: 'javascript'},
  {label: 'Bash', value: 'bash'},
  {label: 'Markup', value: 'markup'},
  {label: 'CSS', value: 'css'},
  {label: 'C Like', value: 'clike'},
  {label: 'YAML', value: 'yaml'},
  {label: 'GraphQL', value: 'graphql'},
  {label: 'Sass', value: 'sass'},
  {label: 'Scss', value: 'scss'},
  {label: 'Markdown', value: 'markdown'},
  {label: 'JSON', value: 'json'},
  {label: 'Django/Jinja2', value: 'django'},
  {label: 'Twig', value: 'twig'},
  {label: 'None', value: null}
];

function matchLabelToValue(value) {
  const selectedLang = options.find(lang => {
    return lang.value === value;
  });
  return selectedLang.label;
}

export default class CodeBlockWrapper extends Component {
  static propTypes = {
    type: PropTypes.string,
    children: PropTypes.any,
    block: PropTypes.any,
    blockProps: PropTypes.any
  };

  handleDisableEditor = () => {
    this.props.blockProps.setReadOnly(true);
  };

  handleEnableEditor = () => {
    this.props.blockProps.setReadOnly(false);
  };

  render() {
    const {changeLang} = this.props.blockProps;
    const lang = this.props.blockProps.lang ? this.props.blockProps.lang : null;
    const languageText = matchLabelToValue(lang);
    return (
      <div className={styles.code}>
        <div className={styles.header}>
          <span className={styles.languageText}>{languageText}</span>
          <IconMenu
            onSelect={this.handleDisableEditor}
            onHide={this.handleEnableEditor}
            onShow={this.handleDisableEditor}
            className={styles.menu}
            icon="code"
            position="topRight"
            menuRipple
          >
            {options.map(option => (
              <MenuItem tabIndex="0" onBlur={this.handleEnableEditor} key={option.value}>
                <LanguageOption
                  setReadOnly={this.props.blockProps.setReadOnly}
                  changeLang={changeLang}
                  active={lang === option.value}
                  {...option}
                />
              </MenuItem>
            ))}
          </IconMenu>
        </div>
        <pre>
          <EditorBlock {...this.props} />
        </pre>
      </div>
    );
  }
}
