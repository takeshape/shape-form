import compose from 'lodash/fp/compose';
import {connect} from 'react-redux';
import {DragSource} from 'react-dnd';
import {SOURCE_TYPE} from '../constants';

import {bindMeta, clearArrayItemPlaceholder} from '../actions';

export const spec = {
  beginDrag(props) {
    return {path: props.path, value: props.value, isNew: true};
  },
  canDrag(props) {
    return props.enabled !== false;
  },
  endDrag(props, monitor) {
    const result = monitor.getDropResult();
    if (!result || !result.added) {
      props.clearPlaceholder();
    }
  }
};

export const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
});

const dragSource = DragSource(SOURCE_TYPE, spec, collect);

export default function decorator(formName, path) {
  const bind = bindMeta(formName, path);
  return compose(
    connect(
      null,
      {clearPlaceholder: bind(clearArrayItemPlaceholder)}
    ),
    dragSource
  );
}
