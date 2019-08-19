import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import theme from './image-block.scss';
import ImagePreview from './image-preview/image-preview';
import ImageCaptionBar from './image-caption-bar/image-caption-bar';
import ImagePropertiesBar from './image-properties-bar/image-properties-bar';
import {formatRawContent} from '../../utils';
import {IMAGE_BLOCK_FORM_NAME} from 'app/form-dialog/constants';
import {imageBlockSchema, imageBlockConfig} from 'app/form-dialog/form-schemas';

export default class ImageBlock extends PureComponent {
  static propTypes = {
    asset: PropTypes.object,
    loading: PropTypes.bool,
    error: PropTypes.string,
    draggedItem: PropTypes.object,
    openAssetPicker: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    getContent: PropTypes.func.isRequired,
    showFormDialog: PropTypes.func.isRequired,
    block: PropTypes.object.isRequired,
    blockProps: PropTypes.object.isRequired,
    contentState: PropTypes.object.isRequired,
    formContext: PropTypes.object
  };

  getData = () => {
    return this.props.contentState.getEntity(this.props.block.getEntityAt(0)).getData();
  };

  setData = data => {
    this.props.blockProps.onChange({...data, contentTypeId: 'ASSET'});
  };

  setCaptionCreditWithFormDialog = () => {
    const data = this.getData();
    const {id} = data;
    const initialData = {
      ...data,
      caption: formatRawContent(data.caption),
      credit: formatRawContent(data.credit)
    };
    const callback = imageData => {
      this.setData({...imageData, id});
    };

    this.props.showFormDialog({
      title: 'Image Caption and Credit',
      formName: IMAGE_BLOCK_FORM_NAME,
      initialData,
      schema: imageBlockSchema,
      config: imageBlockConfig,
      callback
    });
  };

  handleToggle = event => {
    if (event) {
      event.stopPropagation();
    }
    this.setCaptionCreditWithFormDialog();
  };

  ensureContent = props => {
    const {error, loading, getContent, asset, formContext} = props;

    const contentId = this.getData().id;
    if (!error && !loading && contentId && formContext && formContext.locale && !asset) {
      getContent({contentTypeId: 'ASSET', contentId, locale: formContext.locale});
    }
  };

  handleClick = event => {
    event.preventDefault();
    this.props.openAssetPicker();
  };

  componentDidMount() {
    this.ensureContent(this.props);
    if (!this.getData().id) {
      this.props.openAssetPicker();
    }
  }

  render() {
    const {asset, draggedItem, connectDropTarget} = this.props;

    let path;
    let title;

    if (draggedItem) {
      path = draggedItem.path;
    } else if (asset) {
      path = asset.get('path');
      title = asset.get('title');
    }

    const data = this.getData();
    const {caption, credit, alignment, size} = data;

    return connectDropTarget(
      <div>
        <div className={theme.image}>
          <ImagePropertiesBar onEdit={this.handleToggle} title={title} alignment={alignment} size={size} />
          <ImagePreview path={path} isDraggedOn={draggedItem} onClick={this.handleClick} />
          <ImageCaptionBar onEdit={this.handleToggle} caption={caption} credit={credit} />
        </div>
      </div>
    );
  }
}
