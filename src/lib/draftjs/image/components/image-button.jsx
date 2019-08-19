import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {IconButton} from 'react-toolbox/lib/button';
import {addImage} from '../index';
import theme from '../../button-style.scss';

const preventBubblingUp = event => {
  event.preventDefault();
};

export default class ImageButton extends PureComponent {
  static propTypes = {
    editorState: PropTypes.object.isRequired,
    setEditorState: PropTypes.func.isRequired,
    theme: PropTypes.object
  };

  handleClick = () => {
    const {editorState, setEditorState} = this.props;
    const state = editorState;
    setEditorState(addImage(state));
  };

  render() {
    return (
      <div className={theme.button} onMouseDown={preventBubblingUp}>
        <IconButton title="Image" className={theme['button-icon']} onClick={this.handleClick} icon="collections" />
      </div>
    );
  }
}
