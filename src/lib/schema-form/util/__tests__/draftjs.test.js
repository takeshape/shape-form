import {EditorState, ContentState, convertToRaw} from 'draft-js';
import {fromJS} from 'immutable';
import {serializeDraftJs, deserializeDraftJs, toPojo} from '../draftjs';

const schema = fromJS({
  type: 'object',
  properties: {
    _id: {
      title: 'Id',
      type: 'string'
    },
    _contentTypeId: {
      title: 'Content Type Id',
      type: 'string'
    },
    _version: {
      title: 'Version',
      type: 'integer'
    },
    _createdAt: {
      title: 'Created Date',
      type: 'string',
      format: 'date-time'
    },
    _updatedAt: {
      title: 'Updated Date',
      type: 'string',
      format: 'date-time'
    },
    _enabled: {
      title: 'Enabled',
      type: 'boolean'
    },
    _enabledAt: {
      title: 'Enabled Date',
      type: 'string',
      format: 'date-time'
    },
    title: {
      description: '',
      title: ' Title',
      type: 'string',
      key: 'H1dMCxyEx'
    },
    body: {
      description: '',
      draftjs: true,
      title: 'Body',
      type: 'object',
      key: 'B1NCmQyVg'
    },
    gallery: {
      description: '',
      type: 'array',
      title: 'Gallery',
      items: {
        type: 'object',
        properties: {
          image: {
            description: '',
            title: 'Image',
            type: 'object',
            relationship: true,
            key: 'r15d-81Ng',
            properties: {
              contentTypeId: {
                type: 'string',
                enum: ['ASSET']
              },
              id: {
                type: 'string'
              }
            },
            required: ['contentTypeId', 'id']
          },
          caption: {
            description: '',
            type: 'object',
            draftjs: true,
            title: 'Caption',
            key: 'SJlYZLyNx'
          }
        }
      },
      key: 'SyxdZI1Nl'
    }
  }
});

test('serializeDraftJs', async () => {
  const body = ContentState.createFromText('Hello World');
  const caption1 = ContentState.createFromText('Image One');
  const caption2 = ContentState.createFromText('Image Two');
  const data = fromJS({
    title: 'test data',
    body: EditorState.createWithContent(body),
    gallery: [
      {
        image: {
          contentTypeId: 'ASSET',
          id: 'image1'
        },
        caption: EditorState.createWithContent(caption1)
      },
      {
        image: {
          contentTypeId: 'ASSET',
          id: 'image2'
        },
        caption: EditorState.createWithContent(caption2)
      }
    ]
  });

  const expected = {
    title: 'test data',
    body: convertToRaw(body),
    gallery: [
      {
        image: {
          contentTypeId: 'ASSET',
          id: 'image1'
        },
        caption: convertToRaw(caption1)
      },
      {
        image: {
          contentTypeId: 'ASSET',
          id: 'image2'
        },
        caption: convertToRaw(caption2)
      }
    ]
  };

  const actual = serializeDraftJs(schema, data);
  expect(actual.toJS()).toEqual(expected);
});

test('serializeDraftJs - toPojo', async () => {
  const body = ContentState.createFromText('Hello World');
  const caption1 = ContentState.createFromText('Image One');
  const caption2 = ContentState.createFromText('Image Two');
  const data = fromJS({
    title: 'test data',
    body: EditorState.createWithContent(body),
    gallery: [
      {
        image: {
          contentTypeId: 'ASSET',
          id: 'image1'
        },
        caption: EditorState.createWithContent(caption1)
      },
      {
        image: {
          contentTypeId: 'ASSET',
          id: 'image2'
        },
        caption: EditorState.createWithContent(caption2)
      }
    ]
  });

  const expected = {
    title: 'test data',
    body: convertToRaw(body),
    gallery: [
      {
        image: {
          contentTypeId: 'ASSET',
          id: 'image1'
        },
        caption: convertToRaw(caption1)
      },
      {
        image: {
          contentTypeId: 'ASSET',
          id: 'image2'
        },
        caption: convertToRaw(caption2)
      }
    ]
  };

  const actual = serializeDraftJs(schema, data, true);
  expect(actual).toEqual(expected);
});

test('deserializeDraftJs', async () => {
  const body = ContentState.createFromText('Hello World');
  const caption1 = ContentState.createFromText('Image One');
  const caption2 = ContentState.createFromText('Image Two');
  const data = fromJS({
    title: 'test data',
    body: convertToRaw(body),
    gallery: [
      {
        image: {
          contentTypeId: 'ASSET',
          id: 'image1'
        },
        caption: convertToRaw(caption1)
      },
      {
        image: {
          contentTypeId: 'ASSET',
          id: 'image2'
        },
        caption: convertToRaw(caption2)
      }
    ]
  });

  const expected = {
    title: 'test data',
    gallery: [
      {
        image: {
          contentTypeId: 'ASSET',
          id: 'image1'
        }
      },
      {
        image: {
          contentTypeId: 'ASSET',
          id: 'image2'
        }
      }
    ]
  };

  const actual = deserializeDraftJs(schema, data);
  expect(actual.toJS()).toMatchObject(expected);
  expect(actual.get('body') instanceof EditorState).toBe(true);
  expect(actual.getIn(['gallery', 0, 'caption']) instanceof EditorState).toBe(true);
  expect(actual.getIn(['gallery', 1, 'caption']) instanceof EditorState).toBe(true);
});

test('deserializeDraftJs - fromPojo', async () => {
  const body = ContentState.createFromText('Hello World');
  const caption1 = ContentState.createFromText('Image One');
  const caption2 = ContentState.createFromText('Image Two');
  const data = {
    title: 'test data',
    body: convertToRaw(body),
    gallery: [
      {
        image: {
          contentTypeId: 'ASSET',
          id: 'image1'
        },
        caption: convertToRaw(caption1)
      },
      {
        image: {
          contentTypeId: 'ASSET',
          id: 'image2'
        },
        caption: convertToRaw(caption2)
      }
    ]
  };

  const expected = {
    title: 'test data',

    gallery: [
      {
        image: {
          contentTypeId: 'ASSET',
          id: 'image1'
        }
      },
      {
        image: {
          contentTypeId: 'ASSET',
          id: 'image2'
        }
      }
    ]
  };

  const actual = deserializeDraftJs(schema, data);
  expect(actual.toJS()).toMatchObject(expected);
  expect(actual.get('body') instanceof EditorState).toBe(true);
  expect(actual.getIn(['gallery', 0, 'caption']) instanceof EditorState).toBe(true);
  expect(actual.getIn(['gallery', 1, 'caption']) instanceof EditorState).toBe(true);
});

test('toPojo', async () => {
  const expected = {
    a: 1,
    b: 2,
    c: [4, 5, 6],
    d: {
      e: [
        {
          f: 7,
          g: 8
        },
        {
          h: [9, 10, 11]
        }
      ]
    }
  };

  const input = fromJS(expected);

  expect(toPojo(input)).toEqual(expected);
});

test('toPojo - transform', async () => {
  const input = fromJS({
    a: 1,
    b: 2,
    c: [4, 5, 6],
    d: {
      e: [
        {
          f: 7,
          g: 8
        },
        {
          h: [9, 10, 11]
        }
      ]
    }
  });

  const transform = x => x + 1;

  const expected = {
    a: 2,
    b: 3,
    c: [5, 6, 7],
    d: {
      e: [
        {
          f: 8,
          g: 9
        },
        {
          h: [10, 11, 12]
        }
      ]
    }
  };

  expect(toPojo(input, transform)).toEqual(expected);
});
