import {formatRawContent, rawContentHasText} from '../utils';

const testString = 'wonderful chunk of text';

const emptyRawContent = {
  entityMap: {},
  blocks: [
    {
      text: '',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {}
    }
  ]
};

const textfulRawContent = {
  entityMap: {},
  blocks: [
    {
      text: testString,
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {}
    }
  ]
};

test('formatRawContent falsy value', () => {
  expect(formatRawContent('')).toMatchObject(emptyRawContent);
});

test('formatRawContent string value', () => {
  expect(formatRawContent(testString)).toMatchObject(textfulRawContent);
});

test('formatRawContent rawContent value', () => {
  expect(formatRawContent(textfulRawContent)).toMatchObject(textfulRawContent);
});

test('rawContentHasText with text', () => {
  expect(rawContentHasText(textfulRawContent)).toBeTruthy();
});

test('rawContentHasText no text', () => {
  expect(rawContentHasText(emptyRawContent)).toBeFalsy();
});

test('rawContentHasText errors without rawContext parameter', () => {
  expect(() => rawContentHasText(testString)).toThrowError(TypeError);
});
