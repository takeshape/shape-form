import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
const renderer = new ReactShallowRenderer();
import ObjectField from '../index';

describe('ObjectField', () => {
  it('renders without required', () => {
    const schema = {
      type: 'object',
      properties: {
        email: {type: 'string'},
        firstName: {type: 'string'},
        lastName: {type: 'string'}
      }
    };
    const props = {
      schema,
      formName: 'test-form',
      path: '',
      config: {},
      context: {foo: 'bar'},
      widgets: {},
      locale: 'pt-br'
    };
    const tree = renderer.render(<ObjectField {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders with required', () => {
    const schema = {
      type: 'object',
      properties: {
        email: {type: 'string'},
        firstName: {type: 'string'},
        lastName: {type: 'string'}
      },
      required: ['email']
    };
    const props = {
      schema,
      formName: 'test-form',
      path: 'user',
      config: {},
      locale: 'pt-br'
    };
    const tree = renderer.render(<ObjectField {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders with title and required', () => {
    const schema = {
      title: 'User',
      type: 'object',
      properties: {
        firstName: {type: 'string'},
        lastName: {type: 'string'},
        email: {type: 'string'}
      }
    };
    const props = {
      schema,
      formName: 'test-form',
      path: 'user',
      config: {},
      isRequired: true,
      locale: 'pt-br'
    };
    const tree = renderer.render(<ObjectField {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders with configured order', () => {
    const schema = {
      type: 'object',
      properties: {
        firstName: {type: 'string'},
        lastName: {type: 'string'},
        email: {type: 'string'}
      },
      required: ['email']
    };
    const props = {
      schema,
      formName: 'test-form',
      path: 'user',
      config: {
        order: ['email', 'firstName', 'lastName']
      },
      locale: 'pt-br'
    };
    const tree = renderer.render(<ObjectField {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders with empty order', () => {
    const schema = {
      type: 'object',
      properties: {
        firstName: {type: 'string'},
        lastName: {type: 'string'},
        email: {type: 'string'}
      },
      required: ['email']
    };
    const props = {
      schema,
      formName: 'test-form',
      path: 'user',
      config: {
        order: []
      },
      locale: 'pt-br',
      context: {
        projectId: 'project_id',
        contentTypeId: 'content_type_id',
        contentId: 'content_id'
      }
    };
    const tree = renderer.render(<ObjectField {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('handles invalid property names in order', () => {
    const schema = {
      type: 'object',
      properties: {
        firstName: {type: 'string'},
        lastName: {type: 'string'},
        email: {type: 'string'}
      },
      required: ['email']
    };
    const props = {
      schema,
      formName: 'test-form',
      path: 'user',
      config: {
        order: ['email', 'bogus', 'firstName', 'lastName']
      },
      locale: 'pt-br'
    };
    const tree = renderer.render(<ObjectField {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders emptyObject widget', () => {
    const schema = {
      type: 'object',
      properties: {}
    };
    const props = {
      schema,
      widgets: {
        emptyObject: 'EmptyObject'
      },
      formName: 'test-form',
      path: 'user',
      config: {},
      locale: 'pt-br',
      context: {}
    };
    const tree = renderer.render(<ObjectField {...props} />);
    expect(tree).toMatchSnapshot();
  });
});
