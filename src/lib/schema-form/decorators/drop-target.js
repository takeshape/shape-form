import {DropTarget} from 'react-dnd';
import {ITEM_TYPE, SOURCE_TYPE} from '../constants';
import {containerDropTargetSpec, dropTargetCollect} from './dnd';

export default DropTarget([SOURCE_TYPE, ITEM_TYPE], containerDropTargetSpec, dropTargetCollect);
