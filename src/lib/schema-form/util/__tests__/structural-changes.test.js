import {fromJS} from 'immutable';
import {PROPERTIES} from '../../paths';
import {initStructuralChanges, flattenStructuralChanges} from '../structural-changes';

const schema = fromJS({
  type: 'object',
  properties: {
    people: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          fullName: {type: 'string'},
          email: {type: 'string'},
          nicknames: {type: 'array'},
          body: {
            type: 'object',
            draftjs: true
          },
          addresses: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                street: {type: 'string'},
                city: {type: 'string'},
                zip: {type: 'string'}
              }
            }
          }
        }
      }
    }
  }
});

const initialData = fromJS({
  people: [
    {
      fullName: 'John',
      email: null,
      body: {},
      addresses: [
        {
          street: 'Alpha',
          city: 'Stonington',
          zip: '06378'
        },
        {
          street: 'Omega',
          city: 'Stonington',
          zip: '06378'
        },
        {
          street: 'Pineapple',
          city: 'Brooklyn',
          zip: '11201'
        }
      ]
    },
    {
      fullName: 'Bill',
      email: null,
      body: {},
      addresses: [
        {
          street: 'Monitor',
          city: 'Brooklyn',
          zip: '11222'
        }
      ]
    }
  ]
});

test('initStructuralChanges', () => {
  const expected = {
    people: {
      '0': {
        addresses: {
          [PROPERTIES]: {
            arrayKeys: [0, 1, 2],
            nextKey: 3,
            originalSize: 3
          }
        }
      },
      '1': {
        addresses: {
          [PROPERTIES]: {
            arrayKeys: [0],
            nextKey: 1,
            originalSize: 1
          }
        }
      },
      [PROPERTIES]: {
        arrayKeys: [0, 1],
        nextKey: 2,
        originalSize: 2
      }
    }
  };

  expect(initStructuralChanges(schema, initialData).toJS()).toEqual(expected);
});

test('flattenStructuralChanges', () => {
  const changes = fromJS({
    people: {
      '0': {
        addresses: {
          [PROPERTIES]: {
            arrayKeys: [2, 1, 0],
            nextKey: 3,
            originalSize: 2
          }
        }
      },
      '1': {
        addresses: {
          [PROPERTIES]: {
            arrayKeys: [0, 1],
            nextKey: 2,
            originalSize: 2
          }
        }
      },
      [PROPERTIES]: {
        arrayKeys: [1, 0],
        nextKey: 2,
        originalSize: 2
      }
    }
  });
  expect(flattenStructuralChanges(changes)).toEqual([
    {
      path: 'people',
      structure: [1, 0]
    },
    {
      path: 'people[0].addresses',
      structure: [2, 1, 0]
    }
  ]);
});
