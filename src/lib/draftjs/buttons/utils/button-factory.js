import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {RichUtils} from 'draft-js';
import {IconButton} from 'react-toolbox/lib/button';
import buttonTheme from '../../button-style.scss';

function getSetInlineStyle(style) {
  return editorState => RichUtils.toggleInlineStyle(editorState, style);
}

function getIsInlineStyleActive(style) {
  return editorState => editorState.getCurrentInlineStyle().has(style);
}

function getSetBlockType(blockType) {
  return editorState => RichUtils.toggleBlockType(editorState, blockType);
}

function getIsBlockTypeActive(blockType) {
  return editorState => {
    const type = editorState
      .getCurrentContent()
      .getBlockForKey(editorState.getSelection().getStartKey())
      .getType();
    return type === blockType;
  };
}

function createStyleButton(getIsActive, getSetActive) {
  return ({style, icon, title}) => {
    const isFontIcon = typeof icon === 'string';
    const isActive = getIsActive(style);
    const setActive = getSetActive(style);

    return class StyleButton extends Component {
      static propTypes = {
        editorState: PropTypes.object.isRequired,
        setEditorState: PropTypes.func.isRequired
      };

      shouldComponentUpdate(nextProps) {
        return nextProps.editorState !== this.props.editorState;
      }

      handleClick = event => {
        event.preventDefault();
        this.props.setEditorState(setActive(this.props.editorState));
      };

      handleMouseDown = event => {
        event.preventDefault();
      };

      render() {
        const className = buttonTheme[isActive(this.props.editorState) ? 'button-icon-active' : 'button-icon'];
        return (
          <div className={buttonTheme.button} onMouseDown={this.handleMouseDown}>
            <IconButton
              className={className}
              onClick={this.handleClick}
              type="button"
              icon={isFontIcon ? icon : null}
              title={title}
            >
              {isFontIcon ? null : icon}
            </IconButton>
          </div>
        );
      }
    };
  };
}

export const createBlockStyleButton = createStyleButton(getIsBlockTypeActive, getSetBlockType);
export const createInlineStyleButton = createStyleButton(getIsInlineStyleActive, getSetInlineStyle);
