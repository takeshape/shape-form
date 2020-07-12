import isDirty from '../is-dirty';

test('isDirty - string', async () => {
  const initialData = undefined;
  const currentData = 'Hello World';

  expect(isDirty(initialData, currentData)).toBe(true);
  expect(isDirty(currentData, currentData)).toBe(false);
});

test('isDirty - undefined + empty string', async () => {
  const initialData = undefined;
  const currentData = '';

  expect(isDirty(initialData, currentData)).toBe(false);
});

test('isDirty - undefined + zero', async () => {
  const initialData = undefined;
  const currentData = 0;

  expect(isDirty(initialData, currentData)).toBe(true);
});

test('isDirty - object', async () => {
  const initialData = {
    a: 1,
    b: 2,
    c: 3
  };
  const currentData1 = {...initialData, c: 4};
  const currentData2 = {...currentData1, c: 3};

  expect(isDirty(initialData, currentData1)).toBe(true);
  expect(isDirty(initialData, currentData2)).toBe(false);
});
