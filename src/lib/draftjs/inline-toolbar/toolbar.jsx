import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {ItalicButton, BoldButton, UnderlineButton, CodeButton} from '../buttons';
import buttonStyles from './buttons.css';
import toolbarStyles from './toolbar.scss';
import {InlineLinkForm, LinkButton} from '../link';

const defaultStructure = [BoldButton, ItalicButton, UnderlineButton, CodeButton];

const defaultTheme = {buttonStyles, toolbarStyles};

function show(top, left, width) {
  return {
    top,
    left,
    width,
    transform: 'translate(-50%) scale(1)',
    transition: 'transform 0.15s cubic-bezier(.3,1.2,.2,1)'
  };
}

const hidden = {
  transform: 'translate(-50%) scale(0)'
};

const linkFormHeight = 78;
const linkFormWidth = 220;
const iconsPerRow = 6;
const iconWidth = 36;
const rowHeight = 34;
const toolbarPadding = 10;

export default class Toolbar extends PureComponent {
  static propTypes = {
    editorState: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    theme: PropTypes.object,
    structure: PropTypes.array,
    setReadOnly: PropTypes.func.isRequired,
    onEditorFocus: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.defaultWidth = Math.min(props.structure.length + 1, iconsPerRow) * iconWidth;

    this.state = {
      position: hidden,
      isLinkFormOpen: false,
      pointerPosition: '50%'
    };
  }

  setPosition = (editorState, isLinkFormOpen) => {
    if (this.isVisible(editorState)) {
      // give window selection time to catch up with draftjs state
      setTimeout(() => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const selectionRect = range ? range.getBoundingClientRect() : undefined;
        if (selectionRect) {
          const rect = this.el.offsetParent.getBoundingClientRect();
          const toolbarWidth = isLinkFormOpen ? linkFormWidth : this.defaultWidth;
          const toolbarOffset = toolbarWidth / 2;
          const toolbarHeight = isLinkFormOpen
            ? linkFormHeight
            : Math.ceil(this.props.structure.length / iconsPerRow) * rowHeight + toolbarPadding;
          let left = selectionRect.left - rect.left + selectionRect.width / 2;
          let pointerPosition = '50%';
          if (left - toolbarOffset < 0) {
            pointerPosition = `${left}px`;
            left = toolbarOffset;
          } else if (left + toolbarOffset > rect.width) {
            pointerPosition = `${left - (rect.width - toolbarWidth)}px`;
            left = rect.width - toolbarOffset;
          }
          const top = selectionRect.top - rect.top - toolbarHeight;

          this.setState({position: show(top, left, toolbarWidth), isLinkFormOpen, pointerPosition});
        }
      }, 0);
    } else {
      this.setState({position: hidden, isLinkFormOpen});
    }
  };

  isVisible = editorState => {
    const selection = editorState.getSelection();
    return (selection.getHasFocus() && !selection.isCollapsed()) || this.state.isLinkFormOpen;
  };

  handleKeyboardShortcut = event => {
    if (event.metaKey && event.keyCode === 75 && this.isVisible(this.props.editorState)) {
      if (this.state.isLinkFormOpen) {
        this.hideLinkForm();
      } else {
        this.showLinkForm();
      }
    }
  };

  componentDidMount() {
    this.setPosition(this.props.editorState);
    window.addEventListener('keydown', this.handleKeyboardShortcut, false);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyboardShortcut);
  }

  componentWillReceiveProps(props) {
    this.setPosition(props.editorState);
  }

  setEl = el => {
    this.el = el;
  };

  setEditorState = editorState => this.props.onChange(editorState);

  showLinkForm = () => {
    this.setPosition(this.props.editorState, true);
  };

  hideLinkForm = () => {
    this.setState({isLinkFormOpen: false});
    this.props.setReadOnly(false);
  };

  render() {
    const {theme = defaultTheme, structure = defaultStructure, editorState, setReadOnly, onEditorFocus} = this.props;
    const {isLinkFormOpen, position, pointerPosition} = this.state;

    if (isLinkFormOpen) {
      return (
        <InlineLinkForm
          editorState={editorState}
          setEditorState={this.setEditorState}
          setReadOnly={setReadOnly}
          position={position}
          hideLinkForm={this.hideLinkForm}
          isOpen={isLinkFormOpen}
          ref={this.setEl}
          setEditorFocus={onEditorFocus}
          pointerPosition={pointerPosition}
        />
      );
    }
    return (
      <div ref={this.setEl} className={theme.toolbarStyles.toolbar} style={position}>
        <LinkButton
          theme={theme.buttonStyles}
          editorState={editorState}
          setEditorState={this.setEditorState}
          showLinkForm={this.showLinkForm}
        />
        {structure.map((Component, index) => (
          <Component
            key={index}
            theme={theme.buttonStyles}
            editorState={editorState}
            setEditorState={this.setEditorState}
          />
        ))}
        <div style={{left: pointerPosition}} className={toolbarStyles.pointer} />
      </div>
    );
  }
}
