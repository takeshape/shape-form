import {DropTarget} from 'react-dnd';
import {connect} from 'react-redux';
import {getContent} from 'app/content/actions';
import {openAssetPicker, closeAssetPicker} from 'app/asset-picker/actions';
import {showFormDialog} from 'app/form-dialog/actions';
import {getContentState} from 'app/content/selectors';
import {ELEMENT_TYPE} from 'app/assets/constants';
import ImageBlock from './image-block';
import {connectFormContext} from 'app/schema-form';

const target = {
  drop(props, monitor) {
    const item = monitor.getItem();
    props.blockProps.onChange({id: item._id});
    props.getContent({
      contentId: item._id,
      locale: props.formContext.locale,
      contentTypeId: 'ASSET',
      callback: payload => {
        const asset = payload.ASSET[item._id];
        props.blockProps.onChange({id: item._id, caption: asset.caption, credit: asset.credit});
      }
    });
  }
};

const collect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    draggedItem: monitor.isOver() ? monitor.getItem() : null
  };
};

function mapStateToProps(state, ownProps) {
  const {id: contentId} = ownProps.contentState.getEntity(ownProps.block.getEntityAt(0)).getData();
  const contentState = getContentState(state, {contentTypeId: 'ASSET', contentId, locale: ownProps.formContext.locale});
  return {
    error: contentState.error,
    loading: contentState.loading,
    asset: contentState.data,
    contentId
  };
}

const ImageBlockDropTarget = DropTarget(ELEMENT_TYPE, target, collect)(ImageBlock);
const connectedTarget = connect(
  mapStateToProps,
  {openAssetPicker, closeAssetPicker, getContent, showFormDialog}
)(ImageBlockDropTarget);

export default connectFormContext(connectedTarget);
