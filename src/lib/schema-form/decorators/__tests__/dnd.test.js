import {addArrayItem, insertArrayItemPlaceholder, swapArrayItems} from '../../actions';

import {
  isAboveMidline,
  itemHover,
  itemDrop,
  containerHover,
  getBoundingClientRect,
  getClientOffset,
  getDropTargetSpec,
  dropTargetCollect
} from '../dnd';

test('isAboveMidline', () => {
  const boundingRect = {top: 100, bottom: 200, left: 50, right: 250};

  expect(isAboveMidline({x: 100, y: 120}, boundingRect)).toBe(true);
  expect(isAboveMidline({x: 100, y: 160}, boundingRect)).toBe(false);
});

const aboveMidline = {
  getClientOffset: () => ({x: 100, y: 120}),
  getBoundingClientRect: () => ({top: 100, bottom: 200, left: 50, right: 250})
};

const belowMidline = {
  getClientOffset: () => ({x: 100, y: 300}),
  getBoundingClientRect: () => ({top: 100, bottom: 400, left: 50, right: 250})
};
const path = 'a/b/c';

test('itemHover - ignore index', () => {
  const props = {
    path,
    hoverIndex: 0
  };

  const item = {
    path,
    index: 0,
    value: {
      foo: 'bar'
    }
  };

  const action = itemHover(props, item, aboveMidline);

  expect(action).toEqual(null);
});

test('itemHover - ignore path', () => {
  const props = {
    path,
    hoverIndex: 0
  };

  const item = {
    path: 'd/e/f',
    index: 1,
    value: {
      foo: 'bar'
    }
  };

  const action = itemHover(props, item, aboveMidline);

  expect(action).toEqual(null);
});

test('itemHover - placeholder', () => {
  const props = {
    path,
    hoverIndex: 0
  };

  const item = {
    path,
    isNew: true,
    index: undefined,
    value: {
      foo: 'bar'
    }
  };

  const action = itemHover(props, item, aboveMidline);

  expect(action).toEqual(insertArrayItemPlaceholder(item.value, 0));
});

test('itemHover - ignore dragging upwards but below midline', () => {
  const props = {
    path,
    hoverIndex: 2
  };

  const item = {
    path,
    index: 3,
    value: {
      foo: 'bar'
    }
  };

  const action = itemHover(props, item, belowMidline);

  expect(action).toEqual(null);
});

test('itemHover - ignore dragging downwards but above midline', () => {
  const props = {
    path,
    hoverIndex: 3
  };

  const item = {
    path,
    index: 2,
    value: {
      foo: 'bar'
    }
  };

  const action = itemHover(props, item, aboveMidline);

  expect(action).toEqual(null);
});

test('itemHover - swap', () => {
  const props = {
    path,
    hoverIndex: 3
  };

  const item = {
    path,
    index: 2,
    value: {
      foo: 'bar'
    }
  };

  const action = itemHover(props, item, belowMidline);

  expect(action).toEqual(swapArrayItems(2, 3));
});

test('itemDrop', () => {
  const props = {
    path,
    hoverIndex: 1
  };

  const item = {
    path,
    isNew: true,
    index: 1,
    value: {
      foo: 'bar'
    }
  };

  expect(itemDrop(props, item)).toEqual(addArrayItem(item.value, 1));
});

test('itemDrop - ignore existing', () => {
  const props = {
    path,
    hoverIndex: 1
  };

  const item = {
    path,
    index: 1,
    value: {
      foo: 'bar'
    }
  };

  expect(itemDrop(props, item)).toBe(null);
});

test('containerHover - add to empty repeater', () => {
  const props = {
    path,
    count: 0
  };

  const item = {
    path,
    isNew: true,
    index: undefined,
    value: {
      foo: 'bar'
    }
  };

  const action = containerHover(props, item, aboveMidline);

  expect(action).toEqual(insertArrayItemPlaceholder(item.value, 0));
});

test('containerHover - add to repeater bottom', () => {
  const props = {
    path,
    count: 2
  };

  const item = {
    path,
    isNew: true,
    index: undefined,
    value: {
      foo: 'bar'
    }
  };

  const action = containerHover(props, item, belowMidline);

  expect(action).toEqual(insertArrayItemPlaceholder(item.value, 2));
});

test('containerHover - ignore existing', () => {
  const props = {
    path,
    count: 2
  };

  const item = {
    path,
    index: 0,
    value: {
      foo: 'bar'
    }
  };

  const action = containerHover(props, item, belowMidline);

  expect(action).toBe(null);
});

test('containerHover - ignore existing placeholder', () => {
  const props = {
    path,
    count: 2,
    placeholderIndex: 2
  };

  const item = {
    path,
    isNew: true,
    index: 2,
    value: {
      foo: 'bar'
    }
  };

  const action = containerHover(props, item, belowMidline);

  expect(action).toBe(null);
});

test('getBoundingClientRect', () => {
  const expectedValue = {top: 100, bottom: 200, left: 50, right: 250};
  const mockEl = {
    getBoundingClientRect: jest.fn(() => expectedValue)
  };

  const getter1 = getBoundingClientRect(mockEl);

  expect(getter1()).toEqual(expectedValue);
  expect(getter1()).toEqual(expectedValue);
  expect(mockEl.getBoundingClientRect).toHaveBeenCalledTimes(2);

  const getter2 = getBoundingClientRect(mockEl);
  expect(getter1).toBe(getter2);
});

test('getClientOffset', () => {
  const expectedValue = {x: 100, y: 120};
  const mockMonitor = {
    getClientOffset: jest.fn(() => expectedValue)
  };

  const getter1 = getClientOffset(mockMonitor);

  expect(getter1()).toEqual(expectedValue);
  expect(getter1()).toEqual(expectedValue);
  expect(mockMonitor.getClientOffset).toHaveBeenCalledTimes(2);

  const getter2 = getClientOffset(mockMonitor);
  expect(getter1).toBe(getter2);
});

test('getDropTargetSpec - canDrop', () => {
  const dropTarget = getDropTargetSpec(jest.fn(), jest.fn());

  const monitor = {
    getItem: () => ({path: 'a/b/c'})
  };

  expect(dropTarget.canDrop({path: 'a/b/c'}, monitor)).toBe(true);
  expect(dropTarget.canDrop({path: 'd/e/f'}, monitor)).toBe(false);
});

test('getDropTargetSpec - hover - ignore handling hover below the top level', () => {
  const handleHover = jest.fn();
  const handleDrop = jest.fn();
  const dropTarget = getDropTargetSpec(handleHover, handleDrop);

  const monitor = {
    getItem: () => ({path: 'a/b/c'}),
    isOver: () => false
  };

  const props = {
    fieldAction: jest.fn()
  };

  const component = {
    domNode: {}
  };

  dropTarget.hover(props, monitor, component);

  expect(handleHover).toHaveBeenCalledTimes(0);
});

test('getDropTargetSpec - hover - handleHover swap', () => {
  const action = swapArrayItems(0, 1);
  const handleHover = jest.fn(() => action);
  const handleDrop = jest.fn();
  const dropTarget = getDropTargetSpec(handleHover, handleDrop);

  const item = {
    index: 0,
    path: 'a/b/c'
  };
  const monitor = {
    getItem: () => item,
    isOver: () => true
  };

  const props = {
    fieldAction: jest.fn()
  };

  const component = {
    domNode: {}
  };

  dropTarget.hover(props, monitor, component);

  expect(handleHover).toHaveBeenCalledTimes(1);
  expect(props.fieldAction).toHaveBeenCalledWith(action);
  expect(item.index).toBe(1);
});

test('getDropTargetSpec - hover - handleHover placeholder', () => {
  const value = {foo: 'bar'};
  const action = insertArrayItemPlaceholder(0, 1);
  const handleHover = jest.fn(() => action);
  const handleDrop = jest.fn();
  const dropTarget = getDropTargetSpec(handleHover, handleDrop);

  const item = {
    isNew: true,
    path: 'a/b/c',
    value
  };
  const monitor = {
    getItem: () => item,
    isOver: () => true
  };

  const props = {
    fieldAction: jest.fn()
  };

  const component = {
    domNode: {}
  };

  dropTarget.hover(props, monitor, component);

  expect(handleHover).toHaveBeenCalledTimes(1);
  expect(props.fieldAction).toHaveBeenCalledWith(action);
  expect(item.index).toBe(1);
});

test('getDropTargetSpec - hover - handleHover no action', () => {
  const handleHover = jest.fn();
  const handleDrop = jest.fn();
  const dropTarget = getDropTargetSpec(handleHover, handleDrop);

  const monitor = {
    getItem: () => ({path: 'a/b/c'}),
    isOver: () => true
  };

  const props = {
    fieldAction: jest.fn()
  };

  const component = {
    domNode: {}
  };

  dropTarget.hover(props, monitor, component);

  expect(handleHover).toHaveBeenCalledTimes(1);
  expect(props.fieldAction).toHaveBeenCalledTimes(0);
});

test('getDropTargetSpec - drop - already handled', () => {
  const handleHover = jest.fn();
  const handleDrop = jest.fn();
  const dropTarget = getDropTargetSpec(handleHover, handleDrop);

  const monitor = {
    getItem: () => ({path: 'a/b/c'}),
    getDropResult: () => ({added: true})
  };

  const props = {
    fieldAction: jest.fn()
  };

  const component = {
    domNode: {}
  };

  dropTarget.drop(props, monitor, component);

  expect(handleDrop).toHaveBeenCalledTimes(0);
  expect(props.fieldAction).toHaveBeenCalledTimes(0);
});

test('getDropTargetSpec - drop - handleDrop no action', () => {
  const value = {foo: 'bar'};
  const handleHover = jest.fn();
  const handleDrop = jest.fn();
  const dropTarget = getDropTargetSpec(handleHover, handleDrop);

  const item = {
    isNew: true,
    path: 'a/b/c',
    value
  };

  const monitor = {
    getItem: () => item,
    getDropResult: () => ({added: false})
  };

  const props = {
    fieldAction: jest.fn()
  };

  const component = {
    domNode: {}
  };

  dropTarget.drop(props, monitor, component);

  expect(handleDrop).toHaveBeenCalledTimes(1);
  expect(props.fieldAction).toHaveBeenCalledTimes(0);
});

test('getDropTargetSpec - drop - handleDrop added', () => {
  const value = {foo: 'bar'};
  const action = addArrayItem(value, 1);
  const handleHover = jest.fn();
  const handleDrop = jest.fn(() => action);
  const dropTarget = getDropTargetSpec(handleHover, handleDrop);

  const item = {
    isNew: true,
    path: 'a/b/c',
    value
  };

  const monitor = {
    getItem: () => item,
    getDropResult: () => ({added: false})
  };

  const props = {
    fieldAction: jest.fn()
  };

  const component = {
    domNode: {}
  };

  const dropResult = dropTarget.drop(props, monitor, component);

  expect(dropResult).toEqual({added: true});
  expect(handleDrop).toHaveBeenCalledTimes(1);
  expect(props.fieldAction).toHaveBeenCalledWith(action);
});

test('dropTargetCollect', () => {
  const connectDropTarget = jest.fn();
  const connect = {
    dropTarget: () => connectDropTarget
  };
  expect(dropTargetCollect(connect)).toEqual({connectDropTarget});
});
