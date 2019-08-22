import memoize from 'lodash/memoize';
import {addArrayItem, swapArrayItems, insertArrayItemPlaceholder} from '../actions';
import {SWAP_ARRAY_ITEMS} from '../action-types';

export function isAboveMidline(clientOffset, hoverBoundingRect) {
  // Get vertical middle
  const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

  // Get pixels to the top
  const hoverClientY = clientOffset.y - hoverBoundingRect.top;

  // when the cursor is above 50%
  return hoverClientY < hoverMiddleY;
}

export function itemHover(props, item, {getClientOffset, getBoundingClientRect}) {
  const dragIndex = item.index;
  const hoverIndex = props.hoverIndex;

  // Don't replace items with themselves
  if (item.path !== props.path || dragIndex === hoverIndex) {
    return null;
  }

  const draggingDownwards = dragIndex < hoverIndex;
  const aboveMidline = isAboveMidline(getClientOffset(), getBoundingClientRect());
  if ((draggingDownwards && !aboveMidline) || (!draggingDownwards && aboveMidline)) {
    if (item.isNew) {
      return insertArrayItemPlaceholder(item.value, hoverIndex);
    }

    return swapArrayItems(dragIndex, hoverIndex);
  }

  return null;
}

export function containerHover(props, item) {
  // we only care about items dragging into the repeater
  if (item.isNew && props.placeholderIndex !== props.count) {
    return insertArrayItemPlaceholder(item.value, props.count);
  }

  return null;
}

export function itemDrop(props, item) {
  if (item.isNew) {
    return addArrayItem(item.value, item.index);
  }

  return null;
}

export const getClientOffset = memoize(monitor => () => monitor.getClientOffset());
export const getBoundingClientRect = memoize(el => () => el.getBoundingClientRect());

export function getDropTargetSpec(handleHover, handleDrop) {
  return {
    canDrop(props, monitor) {
      return monitor.getItem().path === props.path;
    },
    hover(props, monitor, component) {
      if (monitor.isOver({shallow: true})) {
        const item = monitor.getItem();
        const context = {
          getClientOffset: getClientOffset(monitor),
          getBoundingClientRect: getBoundingClientRect(component.domNode)
        };
        const action = handleHover(props, item, context);
        if (action) {
          props.fieldAction(action);
          // Note: we're mutating the monitor item here!
          // Generally it's better to avoid mutations,
          // but it's good here for the sake of performance
          // to avoid expensive index searches.
          if (action.type === SWAP_ARRAY_ITEMS) {
            item.index = action.meta.indexB;
          } else {
            item.index = action.meta.index;
          }
        }
      }
    },
    drop(props, monitor) {
      const dropResult = monitor.getDropResult();
      if (!dropResult || !dropResult.added) {
        const action = handleDrop(props, monitor.getItem());
        if (action) {
          props.fieldAction(action);
          return {added: true};
        }
      }
    }
  };
}

export const containerDropTargetSpec = getDropTargetSpec(containerHover, itemDrop);
export const itemDropTargetSpec = getDropTargetSpec(itemHover, itemDrop);

export const dropTargetCollect = connect => ({
  connectDropTarget: connect.dropTarget()
});
