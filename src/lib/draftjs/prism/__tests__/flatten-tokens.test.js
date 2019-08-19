import flattenTokens from '../flatten-tokens';
import aTagMarkupTokens from './a-tag-markup-tokens.json';
import scriptTagMarkupTokens from './script-tag-markup-tokens.json';
import jsTokens from './js-tokens.json';

test('flattenTokens - markup a tag ', () => {
  const expected = [
    {
      type: 'punctuation',
      content: '<'
    },
    {
      type: 'tag',
      content: 'a'
    },
    {
      type: 'tag',
      content: ' '
    },
    {
      type: 'attr-name',
      content: 'href'
    },
    {
      type: 'punctuation',
      content: '='
    },
    {
      type: 'punctuation',
      content: '"'
    },
    {
      type: 'attr-value',
      content: 'index.html'
    },
    {
      type: 'punctuation',
      content: '"'
    },
    {
      type: 'punctuation',
      content: '>'
    },
    'home',
    {
      type: 'punctuation',
      content: '</'
    },
    {
      type: 'tag',
      content: 'a'
    },
    {
      type: 'punctuation',
      content: '>'
    }
  ];

  const actual = flattenTokens(aTagMarkupTokens, []);
  expect(actual).toEqual(expected);
});

test('flattenTokens - markup script tag', () => {
  const expected = [
    {
      type: 'punctuation',
      content: '<'
    },
    {
      type: 'tag',
      content: 'script'
    },
    {
      type: 'tag',
      content: ' '
    },
    {
      type: 'attr-name',
      content: 'src'
    },
    {
      type: 'punctuation',
      content: '='
    },
    {
      type: 'punctuation',
      content: '"'
    },
    {
      type: 'attr-value',
      content: 'prism.js'
    },
    {
      type: 'punctuation',
      content: '"'
    },
    {
      type: 'tag',
      content: ' '
    },
    {
      type: 'attr-name',
      content: 'data-default-language'
    },
    {
      type: 'punctuation',
      content: '='
    },
    {
      type: 'punctuation',
      content: '"'
    },
    {
      type: 'attr-value',
      content: 'markup'
    },
    {
      type: 'punctuation',
      content: '"'
    },
    {
      type: 'punctuation',
      content: '>'
    },
    {
      type: 'script',
      content: ''
    },
    {
      type: 'punctuation',
      content: '</'
    },
    {
      type: 'tag',
      content: 'script'
    },
    {
      type: 'punctuation',
      content: '>'
    }
  ];

  const actual = flattenTokens(scriptTagMarkupTokens, []);
  expect(actual).toEqual(expected);
});

test('flattenTokens - js tag', () => {
  const expected = [
    {
      type: 'keyword',
      content: 'const'
    },
    ' hello ',
    {
      type: 'operator',
      content: '='
    },
    ' ',
    {
      type: 'punctuation',
      content: '('
    },
    'world',
    {
      type: 'punctuation',
      content: ')'
    },
    ' ',
    {
      type: 'operator',
      content: '='
    },
    {
      type: 'operator',
      content: '>'
    },
    ' ',
    {
      type: 'punctuation',
      content: '{'
    },
    ' console',
    {
      type: 'punctuation',
      content: '.'
    },
    {
      type: 'function',
      content: 'log'
    },
    {
      type: 'punctuation',
      content: '('
    },
    {
      type: 'string',
      content: '`hello '
    },
    {
      type: 'interpolation-punctuation',
      content: '${'
    },
    {
      type: 'interpolation',
      content: 'world'
    },
    {
      type: 'interpolation-punctuation',
      content: '}'
    },
    {
      type: 'string',
      content: '`'
    },
    {
      type: 'punctuation',
      content: ')'
    },
    ' ',
    {
      type: 'punctuation',
      content: '}'
    },
    {
      type: 'punctuation',
      content: ';'
    }
  ];

  const actual = flattenTokens(jsTokens, []);
  expect(actual).toEqual(expected);
});
