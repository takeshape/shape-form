import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import DraftOffsetKey from 'draft-js/lib/DraftOffsetKey';
import buttonStyles from './button.css';
import blockTypeSelectStyles from './block-type-select.css';
import toolbarStyles from './toolbar.css';
import DefaultBlockTypeSelect from './default-block-type-select';

const defaultTheme = {buttonStyles, blockTypeSelectStyles, toolbarStyles};

const defaultStructure = [DefaultBlockTypeSelect];

function show(top) {
  return {
    position: {
      top: top - 10,
      left: -18,
      transform: 'scale(1)',
      transition: 'transform 0.15s cubic-bezier(.3,1.2,.2,1)'
    }
  };
}

const hidden = {
  position: {
    transform: 'scale(0)'
  }
};

function getSelectionRect(parentEl, editorState, selection) {
  const currentBlock = editorState.getCurrentContent().getBlockForKey(selection.getStartKey());
  const offsetKey = DraftOffsetKey.encode(currentBlock.getKey(), 0, 0);
  const blockEl = parentEl.querySelector(`[data-offset-key="${offsetKey}"]`);
  return blockEl ? blockEl.getBoundingClientRect() : null;
}

export default class Toolbar extends PureComponent {
  static propTypes = {
    editorState: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    theme: PropTypes.object,
    structure: PropTypes.array
  };

  state = hidden;

  setPosition = editorState => {
    const selection = editorState.getSelection();
    const block = editorState.getCurrentContent().getBlockForKey(selection.getStartKey());
    const blockSize = block.getCharacterList().count();
    const blockType = block.getType();
    if (!selection.getHasFocus() || blockSize !== 0 || blockType !== 'unstyled') {
      this.setState(hidden);
      return;
    }

    setTimeout(() => {
      const {offsetParent} = this.el;
      const selectionRect = getSelectionRect(offsetParent, editorState, selection);
      if (selectionRect) {
        const blockTop = selectionRect.top;
        const offsetParentTop = offsetParent.getBoundingClientRect().top;
        this.setState(show(blockTop - offsetParentTop));
      }
    }, 0);
  };

  componentDidMount() {
    this.setPosition(this.props.editorState);
  }

  componentDidUpdate(prevProps) {
    if (this.props.editorState !== prevProps.editorState) {
      this.setPosition(this.props.editorState);
    }
  }

  setEl = el => {
    this.el = el;
  };

  setEditorState = editorState => this.props.onChange(editorState);

  render() {
    const {theme = defaultTheme, structure = defaultStructure} = this.props;
    return (
      <div ref={this.setEl} className={theme.toolbarStyles.wrapper} style={this.state.position}>
        {structure.map((Component, index) => (
          <Component
            key={index}
            editorState={this.props.editorState}
            setEditorState={this.setEditorState}
            theme={theme}
          />
        ))}
      </div>
    );
  }
}
