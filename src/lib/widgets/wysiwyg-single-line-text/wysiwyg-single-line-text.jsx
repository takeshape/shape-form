import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {EditorState} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createSingleLinePlugin from 'draft-js-single-line-plugin';
import cx from 'classnames';
import InlineToolbar from 'app/common/draftjs/inline-toolbar';
import createBasicKeyboardShortcutsPlugin from '../../../draftjs/basic-keyboard-shortcuts';
import createLinkPlugin from '../../../draftjs/link';
import styles from './wysiwyg-single-line-text.scss';
import Widget from '../widget';

import {ItalicButton, BoldButton, UnderlineButton} from '../../../draftjs/buttons';

const inlineToolbarStructure = [BoldButton, ItalicButton, UnderlineButton];

const linkPlugin = createLinkPlugin();
const singleLinePlugin = createSingleLinePlugin({stripEntities: false});
const basicKeyboardShortcutsPlugin = createBasicKeyboardShortcutsPlugin();
const plugins = [linkPlugin, singleLinePlugin, basicKeyboardShortcutsPlugin];

const createEmpty = EditorState.createEmpty();

function ignoreDnd(selection, dataTransfer, source) {
  return source === 'external' ? 'handled' : 'not-handled';
}

export default class WysiwygSingleLineText extends PureComponent {
  static propTypes = {
    value: PropTypes.any.isRequired,
    onChangeSilent: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    disabled: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {readOnly: false};
  }

  handleFocus = () => {
    this.editor.focus();
  };

  setRef = el => {
    this.editor = el;
  };

  handleChange = editorState => {
    this.props.onChangeSilent(editorState);
  };

  setReadOnly = readOnlyFlag => {
    this.setState({readOnly: readOnlyFlag});
  };

  render() {
    const {value} = this.props;
    const editorState = value || createEmpty;

    const editorClassNames = cx(styles.editor, {
      [styles.disabled]: this.props.disabled
    });
    return (
      <Widget {...this.props}>
        <div className={editorClassNames} onClick={this.handleFocus} onBlur={this.props.onBlur}>
          <Editor
            editorState={editorState}
            onChange={this.handleChange}
            plugins={plugins}
            handleDrop={ignoreDnd}
            ref={this.setRef}
            readOnly={this.state.readOnly || this.props.disabled}
            spellCheck
          />
          <InlineToolbar
            editorState={editorState}
            onChange={this.handleChange}
            structure={inlineToolbarStructure}
            setReadOnly={this.setReadOnly}
            onEditorFocus={this.handleFocus}
          />
        </div>
      </Widget>
    );
  }
}
