import PropTypes from 'prop-types';
import React from 'react';
export default class BlockTypeSelect extends React.Component {
  static propTypes = {
    theme: PropTypes.object,
    editorState: PropTypes.object.isRequired,
    setEditorState: PropTypes.func.isRequired,
    structure: PropTypes.array
  };
  state = {
    isToolbarOpen: false,
    isToolbarInFocus: false
  };

  handleOnMouseDown = clickEvent => {
    clickEvent.preventDefault();
    clickEvent.stopPropagation();
    this.setState({isToolbarInFocus: true});
  };

  handleClick = () => {
    this.setState(state => ({isToolbarOpen: !state.isToolbarOpen}));
  };

  handleMouseUp = () => {
    this.setState({isToolbarInFocus: false});
  };

  pageClick = () => {
    if (this.state.isToolbarInFocus) {
      return;
    }
    this.setState({isToolbarOpen: false});
  };

  componentDidMount() {
    window.addEventListener('mousedown', this.pageClick, false);
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.pageClick);
  }

  render() {
    const {theme, editorState, setEditorState} = this.props;
    const {isToolbarOpen} = this.state;
    const transition = 'transform 0.15s cubic-bezier(.3,1.2,.2,1)';
    const toolbarStyle = {transition};
    const iconStyle = {transition};
    if (isToolbarOpen) {
      toolbarStyle.transform = 'translate(-50%) scale(1)';
      iconStyle.transform = 'rotate(45deg)';
    } else {
      toolbarStyle.transform = 'translate(-50%) scale(0)';
      iconStyle.transform = 'rotate(0deg)';
    }

    return (
      <div onMouseDown={this.handleOnMouseDown} onMouseUp={this.handleMouseUp} onClick={this.handleClick}>
        <div className={theme.blockTypeSelectStyles.blockType}>
          <svg style={iconStyle} height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        </div>
        <div className={theme.blockTypeSelectStyles.popup} style={toolbarStyle}>
          {this.props.structure.map((Component, index) => (
            <Component
              key={index}
              editorState={editorState}
              setEditorState={setEditorState}
              theme={theme.buttonStyles}
              onClick={this.handleClick}
            />
          ))}
        </div>
      </div>
    );
  }
}
