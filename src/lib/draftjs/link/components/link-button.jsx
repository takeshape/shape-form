import PropTypes from 'prop-types';
import React, {Component} from 'react';
import unionClassNames from 'union-class-names';
import {IconButton} from 'react-toolbox/lib/button';
import {getLink} from '../utils';
import buttonTheme from '../../button-style.scss';

const preventBubblingUp = event => {
  event.preventDefault();
};

export default class LinkButton extends Component {
  static propTypes = {
    editorState: PropTypes.object.isRequired,
    setEditorState: PropTypes.func.isRequired,
    theme: PropTypes.object,
    showLinkForm: PropTypes.func.isRequired
  };

  getLink = () => {
    return getLink(this.props.editorState);
  };

  handleClick = event => {
    event.preventDefault();
    event.stopPropagation();
    this.props.showLinkForm();
  };

  render() {
    const hasLink = Boolean(this.getLink());
    const className = hasLink ? unionClassNames(buttonTheme['button-icon-active']) : buttonTheme['button-icon'];

    return (
      <div className={buttonTheme.button} onMouseDown={preventBubblingUp}>
        <IconButton title="Link" className={className} onClick={this.handleClick} icon="insert_link" />
      </div>
    );
  }
}
