import {DropTarget} from 'react-dnd/';
import {NativeTypes} from 'react-dnd-html5-backend';
import {ELEMENT_TYPE} from 'app/assets/constants';
import DragAndDropArea from './drop-area';

const {FILE} = NativeTypes;

const target = {
  drop(props, monitor, component) {
    const item = monitor.getItem();
    const {createImageBlock} = props.blockProps;
    if (item._id) {
      createImageBlock({id: item._id});
    } else {
      component.setState({uploading: true});
      props.onDrop(item.files, uploads => {
        uploads.forEach(upload => {
          createImageBlock({id: upload.asset._id});
        });
        component.setState({uploading: false});
      });
    }
  },
  canDrop(props) {
    return props.blockProps.isBlockEmpty;
  }
};

const collect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    draggedItem: monitor.isOver() ? monitor.getItem() : null,
    canHover: monitor.canDrop(),
    fileUpload: monitor.getDropResult()
  };
};

const DragAndDropAreaDropTarget = DropTarget([FILE, ELEMENT_TYPE], target, collect)(DragAndDropArea);

export default DragAndDropAreaDropTarget;
