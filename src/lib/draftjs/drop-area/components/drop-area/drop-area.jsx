import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {EditorBlock} from 'draft-js';
import UploadStatus from 'app/asset-uploader/components/upload-status';
import DropImagePreview from '../drop-image-preview';

export default class DropArea extends PureComponent {
  static propTypes = {
    children: PropTypes.any,
    connectDropTarget: PropTypes.func.isRequired,
    draggedItem: PropTypes.object,
    canHover: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      uploading: false
    };
  }

  render() {
    const {connectDropTarget, draggedItem, canHover, ...other} = this.props;

    let content;

    if (draggedItem && canHover) {
      content = <DropImagePreview path={draggedItem.path} />;
    } else if (this.state.uploading) {
      content = <UploadStatus />;
    } else {
      content = <EditorBlock {...other} />;
    }

    return connectDropTarget(<div>{content}</div>);
  }
}
