import {DragSource, DropTarget} from 'react-dnd';
import compose from 'lodash/fp/compose';
import {ITEM_TYPE, SOURCE_TYPE} from '../constants';
import {itemDropTargetSpec, dropTargetCollect} from './dnd';

export const dragSpec = {
  beginDrag(props) {
    return {path: props.path, index: props.index};
  },
  endDrag(props) {
    return props.onBlur(props.formName, props.path);
  }
};

export const dragCollect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
});

export default compose(
  DragSource(SOURCE_TYPE, dragSpec, dragCollect),
  DropTarget([SOURCE_TYPE, ITEM_TYPE], itemDropTargetSpec, dropTargetCollect)
);
