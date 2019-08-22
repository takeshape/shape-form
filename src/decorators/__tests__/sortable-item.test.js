import decorator, {dragCollect, dragSpec} from '../sortable-item';

test('decorator', () => {
  expect(typeof decorator('test-form', 'columns')).toBe('function');
});

test('dragSpec.beginDrag', () => {
  const props = {
    extra: 'stuff',
    path: 'columns',
    index: 1
  };
  expect(dragSpec.beginDrag(props)).toEqual({
    path: 'columns',
    index: 1
  });
});

test('spec.endDrag', () => {
  const props = {
    formName: 'test-form',
    path: 'collumns',
    onBlur: jest.fn()
  };
  dragSpec.endDrag(props);
  expect(props.onBlur).toHaveBeenCalledWith(props.formName, props.path);
});

test('dragCollect', () => {
  const connectDragSource = jest.fn();
  const connectDragPreview = jest.fn();
  const isDragging = false;
  const monitor = {
    isDragging: () => isDragging
  };
  const connect = {
    dragPreview: () => connectDragPreview,
    dragSource: () => connectDragSource
  };
  expect(dragCollect(connect, monitor)).toEqual({
    connectDragPreview,
    connectDragSource,
    isDragging
  });
});
