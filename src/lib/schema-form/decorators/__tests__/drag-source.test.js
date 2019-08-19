import decorator, {spec, collect} from '../drag-source';

test('decorator', () => {
  expect(typeof decorator('test-form', 'columns')).toBe('function');
});

test('spec.beginDrag', () => {
  const props = {
    extra: 'stuff',
    path: 'columns',
    value: 'woo'
  };
  expect(spec.beginDrag(props)).toEqual({
    path: 'columns',
    value: 'woo',
    isNew: true
  });
});

test('spec.canDrag', () => {
  expect(spec.canDrag({})).toBe(true);
  expect(spec.canDrag({enabled: true})).toBe(true);
  expect(spec.canDrag({enabled: false})).toBe(false);
});

test('spec.endDrag', () => {
  const monitor = {
    getDropResult: jest.fn()
  };
  const props = {
    clearPlaceholder: jest.fn()
  };
  spec.endDrag(props, monitor);
  expect(props.clearPlaceholder).toHaveBeenCalledTimes(1);
});

test('spec.endDrag - already handled', () => {
  const monitor = {
    getDropResult: jest.fn(() => ({added: true}))
  };
  const props = {
    clearPlaceholder: jest.fn()
  };
  spec.endDrag(props, monitor);
  expect(props.clearPlaceholder).toHaveBeenCalledTimes(0);
});

test('collect', () => {
  const connectDragSource = jest.fn();
  const isDragging = false;
  const monitor = {
    isDragging: () => isDragging
  };
  const connect = {
    dragSource: () => connectDragSource
  };
  expect(collect(connect, monitor)).toEqual({connectDragSource, isDragging});
});
