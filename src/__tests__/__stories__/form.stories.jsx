import React from 'react';
import {setAddon, storiesOf} from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import {ShapeForm, SubmitButton} from '../../index';

setAddon(JSXAddon);

const centerStyle = {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '40rem'
};

const CenterDecorator = storyFn => <div style={centerStyle}>{storyFn()}</div>;

storiesOf('Forms', module)
  .addDecorator(CenterDecorator)
  .addWithJSX('Simple form', () => {
    const schema = {
      type: 'object',
      properties: {
        name: {
          title: 'Name',
          type: 'string'
        },
        project: {
          title: 'Template',
          type: 'string',
          enum: ['Template 1', 'Template 2']
        },
        included: {
          title: 'Included',
          type: 'boolean'
        }
      },
      required: ['name']
    };
    return (
      <div>
        <ShapeForm formName="simple" schema={schema} initialData={{name: 'My Project'}} />
        <br />
        <SubmitButton formName="simple" />
      </div>
    );
  })
  .addWithJSX('Array fields', () => {
    const schema = {
      type: 'object',
      properties: {
        favorites: {
          type: 'array',
          title: 'Favorites',
          items: {
            type: 'object',
            properties: {
              name: {
                title: 'Name',
                type: 'string'
              },
              thing: {
                title: 'Thing',
                type: 'string'
              }
            }
          }
        }
      }
    };
    return (
      <div>
        <ShapeForm formName="array" schema={schema} initialData={{name: 'My Project'}} />
        <br />
        <SubmitButton formName="array" />
      </div>
    );
  });
