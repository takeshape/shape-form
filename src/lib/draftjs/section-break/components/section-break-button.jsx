import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {IconButton} from 'react-toolbox/lib/button';
import {addSectionBreak} from '../../../draftjs/section-break';
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
    setEditorState(addSectionBreak(state));
  };

  render() {
    return (
      <div className={theme.button} onMouseDown={preventBubblingUp}>
        <IconButton title="Section Break" className={theme['button-icon']} onClick={this.handleClick}>
          <svg
            height="100%"
            style={{fillRule: 'evenodd', clipRule: 'evenodd', strokeLinejoin: 'round', strokeMiterlimit: '1.41421'}}
            width="100%"
            version="1.1"
            viewBox="0 0 12 2"
            xmlSpace="preserve"
          >
            <rect height="1.5" width="5.25" x="0" y="0" />
            <rect height="1.5" width="5.25" x="6.75" y="0" />
          </svg>
        </IconButton>
      </div>
    );
  }
}
