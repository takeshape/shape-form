import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {EditorState, DefaultDraftBlockRenderMap} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import {Map} from 'immutable';

import createBlockBreakoutPlugin from 'draft-js-block-breakout-plugin';
import createMarkdownShortcutsPlugin from '../../../draftjs/markdown-shortcuts';
import SideToolbar from 'app/common/draftjs/side-toolbar';
import InlineToolbar from 'app/common/draftjs/inline-toolbar';
import createImagePlugin from '../../../draftjs/image';
import createLinkPlugin from '../../../draftjs/link';
import createOembedPlugin from '../../../draftjs/oembed';
import SideMenu from './side-menu';
import createPrismPlugin from '../../../draftjs/prism';
import createSoftReturnPlugin from '../../../draftjs/soft-return';
import createKeyboardShortcutsPlugin from '../../../draftjs/keyboard-shortcuts';
import styles from './wysiwyg.scss';
import linkStyles from '../../../draftjs/link/styles.scss';
import Widget from '../widget';
import createHorizontalRule from '../../../draftjs/section-break';
import Pullquote from '../../../draftjs/pullquote';
import createDropAreaPlugin from '../../../draftjs/drop-area/drop-area-plugin';
import DisableWrapper from '../../disable-wrapper';

import {registerCopySource, handleDraftEditorPastedText} from 'draftjs-conductor';

import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  BlockquoteButton,
  PullquoteButton,
  SuperscriptButton,
  SubscriptButton
} from '../../../draftjs/buttons';

// Creates an Instance. At this step, a configuration object can be passed in
// as an argument.
const blockBreakoutPlugin = createBlockBreakoutPlugin();
const imagePlugin = createImagePlugin();
const oEmbedPlugin = createOembedPlugin();
const prismPlugin = createPrismPlugin();
const softReturnPlugin = createSoftReturnPlugin();
const horizontalRulePlugin = createHorizontalRule();
const keyboardShortcutsPlugin = createKeyboardShortcutsPlugin();
const markdownShortcutsPlugin = createMarkdownShortcutsPlugin();
const dropAreaPlugin = createDropAreaPlugin();

const inlineToolbarStructure = [
  BoldButton,
  ItalicButton,
  UnderlineButton,
  BlockquoteButton,
  PullquoteButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  SuperscriptButton,
  SubscriptButton,
  CodeButton
];

const blockRenderMap = Map({
  'code-block': {
    element: 'div'
  },
  'section-break': {
    element: 'div'
  },
  pullquote: {
    element: 'div',
    wrapper: <Pullquote />
  }
});

const styleMap = {
  SMALL: {
    fontSize: 'smaller'
  },
  SUB: {
    verticalAlign: 'sub',
    fontSize: 'smaller'
  },
  SUP: {
    verticalAlign: 'super',
    fontSize: 'smaller'
  },
  CODE: {
    fontFamily: `'Roboto Mono', monospace`,
    fontSize: '1.4rem',
    margin: '0 0.2rem',
    border: '1px solid #ddd',
    backgroundColor: '#f8f8f8',
    borderRadius: '3px',
    whiteSpace: 'nowrap'
  }
};

// Include 'paragraph' as a valid block and updated the unstyled element but
// keep support for other draft default block types
const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);

const createEmpty = EditorState.createEmpty();

function ignoreDnd(selection, dataTransfer, source) {
  return source === 'external' ? 'handled' : 'not-handled';
}

export default class DraftJSEditor extends PureComponent {
  static propTypes = {
    value: PropTypes.any.isRequired,
    onChangeSilent: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    schema: PropTypes.object.isRequired,
    disabled: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {readOnly: false};
    const linkPlugin = createLinkPlugin({setReadOnly: this.setReadOnly});

    this.plugins = [
      markdownShortcutsPlugin,
      keyboardShortcutsPlugin,
      blockBreakoutPlugin,
      imagePlugin,
      oEmbedPlugin,
      prismPlugin,
      softReturnPlugin,
      horizontalRulePlugin,
      linkPlugin,
      dropAreaPlugin
    ];
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

  componentDidMount() {
    this.copySource = registerCopySource(this.editor.getEditorRef());
  }

  handlePastedText = (text, html, editorState) => {
    const newState = handleDraftEditorPastedText(html, editorState);

    if (newState) {
      this.handleChange(newState);
      return 'handled';
    }

    return 'not-handled';
  };

  componentWillUnmount() {
    if (this.copySource) {
      this.copySource.unregister();
    }
  }

  render() {
    const {value} = this.props;
    const editorState = value || createEmpty;
    const disabled = this.props.disabled;

    return (
      <Widget {...this.props}>
        <DisableWrapper disabled={disabled}>
          <div className={styles.editor} onClick={this.handleFocus} onBlur={this.props.onBlur}>
            <Editor
              editorState={editorState}
              onChange={this.handleChange}
              handlePastedText={this.handlePastedText} // eslint-disable-line react/jsx-handler-names
              plugins={this.plugins}
              handleDrop={ignoreDnd}
              ref={this.setRef}
              blockRenderMap={extendedBlockRenderMap}
              customStyleMap={styleMap}
              readOnly={this.state.readOnly || disabled}
              spellCheck
            />
            {!disabled && (
              <>
                <InlineToolbar
                  editorState={editorState}
                  onChange={this.handleChange}
                  structure={inlineToolbarStructure}
                  setReadOnly={this.setReadOnly}
                  onEditorFocus={this.handleFocus}
                />
                <SideToolbar editorState={editorState} onChange={this.handleChange} structure={[SideMenu]} />
              </>
            )}
          </div>
          <div className={styles.linkContainer}>
            <a
              className={linkStyles.link}
              target="_blank"
              rel="noopener noreferrer"
              href="http://www.takeshape.io/docs/editor-shortcuts/"
            >
              Keyboard shortcuts
            </a>
          </div>
        </DisableWrapper>
      </Widget>
    );
  }
}
