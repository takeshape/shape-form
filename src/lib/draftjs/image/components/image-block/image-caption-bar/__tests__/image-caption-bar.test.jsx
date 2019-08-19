import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import ImageCaptionBar from '../image-caption-bar';

const renderer = new ReactShallowRenderer();

const emptyDraftJs = {
  entityMap: {},
  blocks: [
    {
      key: 'someKey',
      text: '',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {}
    }
  ]
};

const captionDraftJsUnstyled = {
  entityMap: {},
  blocks: [
    {
      key: 'someKey',
      text: 'a befitting caption for such an image, contained within a draftjs object',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {}
    }
  ]
};

const creditDraftJsUnstyled = {
  entityMap: {},
  blocks: [
    {
      key: 'someKey',
      text: 'credit to the photographer, contained within a draftjs object',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {}
    }
  ]
};

const richCaption = {
  entityMap: {},
  blocks: [
    {
      key: 'someKey',
      text: 'A BOLD and UNDERLINED caption.',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [
        {
          offset: 2,
          length: 4,
          style: 'BOLD'
        },
        {
          offset: 11,
          length: 10,
          style: 'UNDERLINE'
        }
      ],
      entityRanges: [],
      data: {}
    }
  ]
};

const richCredit = {
  entityMap: {
    0: {
      type: 'LINK',
      mutability: 'MUTABLE',
      data: {
        url: 'http://www.takeshape.io',
        target: '_blank'
      }
    }
  },
  blocks: [
    {
      key: '8uko0',
      text: 'ITALICIZED and LINKED credit.',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [
        {
          offset: 0,
          length: 10,
          style: 'ITALIC'
        }
      ],
      entityRanges: [
        {
          offset: 15,
          length: 6,
          key: 0
        }
      ],
      data: {}
    }
  ]
};

test('empty caption bar - no edit function', () => {
  const props = {
    caption: null,
    credit: null,
    onEdit: null
  };

  const tree = renderer.render(<ImageCaptionBar {...props} />);
  expect(tree).toMatchSnapshot();
});

test('empty caption bar - with edit function', () => {
  const props = {
    caption: null,
    credit: null,
    onEdit: jest.fn()
  };

  const tree = renderer.render(<ImageCaptionBar {...props} />);
  expect(tree).toMatchSnapshot();
});

test('empty caption bar - caption credit empty strings', () => {
  const props = {
    caption: '',
    credit: '',
    onEdit: jest.fn()
  };

  const tree = renderer.render(<ImageCaptionBar {...props} />);
  expect(tree).toMatchSnapshot();
});

test('empty caption bar - caption credit empty draftjs object', () => {
  const props = {
    caption: emptyDraftJs,
    credit: emptyDraftJs,
    onEdit: jest.fn()
  };

  const tree = renderer.render(<ImageCaptionBar {...props} />);
  expect(tree).toMatchSnapshot();
});

test('rendered caption bar - caption credit contentful strings', () => {
  const props = {
    caption: 'a befitting caption for such an image',
    credit: 'credit to the photographer',
    onEdit: jest.fn()
  };

  const tree = renderer.render(<ImageCaptionBar {...props} />);
  expect(tree).toMatchSnapshot();
});

test('rendered caption bar - caption draftjs object', () => {
  const props = {
    caption: captionDraftJsUnstyled,
    credit: emptyDraftJs,
    onEdit: jest.fn()
  };

  const tree = renderer.render(<ImageCaptionBar {...props} />);
  expect(tree).toMatchSnapshot();
});

test('rendered caption bar - credit draftjs object', () => {
  const props = {
    caption: emptyDraftJs,
    credit: creditDraftJsUnstyled,
    onEdit: jest.fn()
  };

  const tree = renderer.render(<ImageCaptionBar {...props} />);
  expect(tree).toMatchSnapshot();
});

test('rendered caption bar - full unstyled', () => {
  const props = {
    caption: captionDraftJsUnstyled,
    credit: creditDraftJsUnstyled,
    onEdit: jest.fn()
  };

  const tree = renderer.render(<ImageCaptionBar {...props} />);
  expect(tree).toMatchSnapshot();
});

test('rendered caption bar - full styled', () => {
  const props = {
    caption: richCaption,
    credit: richCredit,
    onEdit: jest.fn()
  };

  const tree = renderer.render(<ImageCaptionBar {...props} />);
  expect(tree).toMatchSnapshot();
});
