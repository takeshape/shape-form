import {PROPERTIES} from '../../paths';

export const menuSchema = {
  type: 'object',
  properties: {
    name: {type: 'string'},
    menu: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        properties: {
          sectionName: {type: 'string'},
          items: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              properties: {
                name: {type: 'string'},
                ingredients: {
                  type: 'array',
                  minItems: 1,
                  items: {
                    type: 'object',
                    properties: {
                      name: {type: 'string'},
                      origin: {type: 'string'}
                    },
                    required: ['name', 'origin']
                  }
                }
              },
              required: ['name', 'ingredients']
            }
          }
        },
        required: ['sectionName', 'items']
      }
    }
  },
  required: ['name', 'menu']
};

export const menuData = {
  name: 'Pizza Party',
  menu: [
    {
      sectionName: 'Drinks',
      items: [
        {
          name: 'Aperol Spritz',
          ingredients: [
            {
              name: 'Aperol',
              origin: 'Italy'
            },
            {
              name: 'Prosecco',
              origin: 'Italy'
            },
            {
              name: 'Seltzer',
              origin: 'NYC'
            },
            {
              name: 'Orange Slice',
              origin: 'Florida'
            }
          ]
        },
        {
          name: 'Negroni',
          ingredients: [
            {
              name: 'Dorothy Parker Gin',
              origin: 'Brooklyn'
            },
            {
              name: 'Antica Formula',
              origin: 'Italy'
            },
            {
              name: 'Campari',
              origin: 'Italy'
            }
          ]
        }
      ]
    },
    {
      sectionName: 'Food',
      items: [
        {
          name: 'Margherita Pizza',
          ingredients: [
            {
              name: 'Buffalo Mozzerella',
              origin: 'Italy'
            },
            {
              name: 'San Marzano Tomatoes',
              origin: 'California'
            },
            {
              name: 'Basil',
              origin: 'Brooklyn'
            }
          ]
        }
      ]
    }
  ]
};

export const menuFormState = {
  forms: {
    'test-form': {
      data: menuData,
      initialData: menuData,
      schema: menuSchema,
      errors: {},
      submitted: false,
      dirty: new Set(),
      ui: {
        menu: {
          '0': {
            items: {
              '0': {
                ingredients: {
                  [PROPERTIES]: {
                    arrayKeys: [0, 1, 2, 3],
                    collapsed: new Set()
                  }
                }
              },
              '1': {
                ingredients: {
                  [PROPERTIES]: {
                    arrayKeys: [0, 1, 2],
                    collapsed: new Set()
                  }
                }
              },
              [PROPERTIES]: {
                arrayKeys: [0, 1],
                collapsed: new Set()
              }
            }
          },
          '1': {
            items: {
              '0': {
                ingredients: {
                  [PROPERTIES]: {
                    arrayKeys: [0, 1, 2],
                    collapsed: new Set()
                  }
                }
              },
              [PROPERTIES]: {
                arrayKeys: [0],
                collapsed: new Set()
              }
            }
          },
          [PROPERTIES]: {
            arrayKeys: [0, 1],
            collapsed: new Set()
          }
        }
      }
    }
  }
};
