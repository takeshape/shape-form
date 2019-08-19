import {EditorState, ContentState, convertFromRaw} from 'draft-js';
import {fromJS} from 'immutable';
import inlineStylesRaw from './data/draftjs-inline-styles.json';
import inlineStylesDirtyRaw from './data/draftjs-inline-styles-dirty.json';
import imageEntityRaw from './data/draftjs-image-entity.json';
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
  const initialData = fromJS({
    a: 1,
    b: 2,
    c: 3
  });
  const currentData1 = initialData.set('c', 4);
  const currentData2 = currentData1.set('c', 3);

  expect(isDirty(initialData, currentData1)).toBe(true);
  expect(isDirty(initialData, currentData2)).toBe(false);
});

test('isDirty - draftjs text', async () => {
  const body = ContentState.createFromText('Hello World');
  const initialData = EditorState.createWithContent(body);

  const dirtyBody = ContentState.createFromText('Hello Worldz');
  const currentData = EditorState.createWithContent(dirtyBody);

  expect(isDirty(initialData, currentData)).toBe(true);
});

test('isDirty - draftjs undefined initialData is considered equal to an empty content state', async () => {
  const initialData = undefined;
  const currentData = EditorState.createEmpty();

  expect(isDirty(initialData, currentData)).toBe(false);

  const currentData2 = EditorState.createWithContent(convertFromRaw(imageEntityRaw));
  expect(isDirty(initialData, currentData2)).toBe(true);
});

test('isDirty - draftjs diff with text style', async () => {
  const initialData = EditorState.createWithContent(convertFromRaw(inlineStylesRaw));
  const currentData = EditorState.createWithContent(convertFromRaw(inlineStylesDirtyRaw));

  expect(isDirty(initialData, currentData)).toBe(true);
  expect(isDirty(currentData, currentData)).toBe(false);
});
