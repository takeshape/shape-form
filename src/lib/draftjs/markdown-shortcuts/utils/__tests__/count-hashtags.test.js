import countHashtags from '../count-hashtags';

test('countHashtags - one hashtag', () => {
  expect(countHashtags('#')).toBe(1);
});

test('countHashtags - six hashtag', () => {
  expect(countHashtags('######')).toBe(6);
});

test('countHashtags - hashtags with text afterwards', () => {
  expect(countHashtags('### hello world')).toBe(3);
});

test('countHashtags - hashtags with text in between', () => {
  expect(countHashtags('## hello # world #')).toBe(2);
});

test('countHashtags - hashtags with text before', () => {
  expect(countHashtags('hello world ####')).toBe(0);
});

test('countHashtags - no hashtags', () => {
  expect(countHashtags('there are no hashtags in this string')).toBe(0);
});

test('countHashtags - more than six hashtags', () => {
  expect(countHashtags('########')).toBe(6);
});
