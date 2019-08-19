import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import Input from 'react-toolbox/lib/input';
import {IconButton} from 'react-toolbox/lib/button';
import {addLink, removeLink, getLink} from '../utils';
import styles from '../inline-link-form-styles.scss';
import RemoveLinkButton from './remove-link-button';

export default class InlineLinkForm extends PureComponent {
  static propTypes = {
    editorState: PropTypes.object.isRequired,
    setEditorState: PropTypes.func.isRequired,
    setReadOnly: PropTypes.func.isRequired,
    position: PropTypes.object.isRequired,
    hideLinkForm: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    setEditorFocus: PropTypes.func.isRequired,
    pointerPosition: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      url: '',
      newWindow: true
    };
  }

  handleChangeUrl = value => {
    this.setState({url: value});
  };

  handleCloseLinkForm = () => {
    this.props.hideLinkForm();

    // setTimeout is needed to prevent editorState selection from changing before the link has been set
    setTimeout(() => this.props.setEditorFocus(), 0);
  };

  saveLink = () => {
    const {url, newWindow} = this.state;
    const target = newWindow ? '_blank' : '_self';
    const {editorState, setEditorState} = this.props;
    if (url) {
      setEditorState(addLink(editorState, url, target));
    } else {
      setEditorState(removeLink(editorState));
    }
  };

  handleSubmitLinkForm = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();

      this.saveLink();
      this.handleCloseLinkForm();
      this.handleBlur();
    }
  };

  handleToggleNewWindow = event => {
    event.preventDefault();
    event.stopPropagation();
    this.setState(state => ({newWindow: !state.newWindow}));
  };

  handleRemoveLink = event => {
    event.preventDefault();
    event.stopPropagation();
    const {editorState, setEditorState} = this.props;
    setEditorState(removeLink(editorState));
    this.handleCloseLinkForm();
  };

  handleInputClick = event => {
    event.stopPropagation();
  };

  handleFocus = () => {
    this.props.setReadOnly(true);
  };

  handleBlur = () => {
    this.props.setReadOnly(false);
  };

  handleOnMouseDown = clickEvent => {
    clickEvent.stopPropagation();
  };

  pageClick = () => {
    const linkData = getLink(this.props.editorState);
    if (linkData) {
      this.saveLink();
    }
    this.handleCloseLinkForm();
  };

  componentDidMount() {
    window.addEventListener('mousedown', this.pageClick, false);
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.pageClick);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen) {
      const linkData = getLink(nextProps.editorState);
      if (linkData) {
        const {url, target} = linkData;
        const newWindow = target === '_blank';
        this.setState({url, newWindow});
      }
    }
  }

  render() {
    const newWindowClassName = this.state.newWindow ? styles.buttonActive : styles.buttonDefault;
    const newWindowTitle = this.state.newWindow ? 'Open in New Window' : 'Open in Same Window';
    const highlightedLink = getLink(this.props.editorState);
    let menuButton;
    if (highlightedLink) {
      menuButton = <RemoveLinkButton className={styles.buttonDefault} onClick={this.handleRemoveLink} />;
    } else {
      menuButton = (
        <IconButton
          title="Close Form"
          className={styles.buttonDefault}
          onClick={this.handleCloseLinkForm}
          icon="clear"
        />
      );
    }

    return (
      <div className={styles.linkForm} style={this.props.position} onMouseDown={this.handleOnMouseDown}>
        <Input
          onKeyPress={this.handleSubmitLinkForm}
          className={styles.linkInput}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onClick={this.handleInputClick}
          autoFocus
          type="text"
          label="Type the url and press enter"
          name="url"
          value={this.state.url}
          onChange={this.handleChangeUrl}
        />
        <IconButton
          title={newWindowTitle}
          className={newWindowClassName}
          onClick={this.handleToggleNewWindow}
          icon="open_in_new"
        />
        {menuButton}
        <div style={{left: this.props.pointerPosition}} className={styles.pointer} />
      </div>
    );
  }
}
