import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
const renderer = new ReactShallowRenderer();
import {Map, fromJS} from 'immutable';
import ObjectField from '../index';

describe('ObjectField', () => {
  it('renders without required', () => {
    const schema = fromJS({
      type: 'object',
      properties: {
        email: {type: 'string'},
        firstName: {type: 'string'},
        lastName: {type: 'string'}
      }
    });
    const props = {
      schema,
      formName: 'test-form',
      path: '',
      config: Map(),
      context: {foo: 'bar'},
      widgets: {},
      locale: 'pt-br'
    };
    const tree = renderer.render(<ObjectField {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders with required', () => {
    const schema = fromJS({
      type: 'object',
      properties: {
        email: {type: 'string'},
        firstName: {type: 'string'},
        lastName: {type: 'string'}
      },
      required: ['email']
    });
    const props = {
      schema,
      formName: 'test-form',
      path: 'user',
      config: Map(),
      locale: 'pt-br'
    };
    const tree = renderer.render(<ObjectField {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders with title and required', () => {
    const schema = fromJS({
      title: 'User',
      type: 'object',
      properties: {
        firstName: {type: 'string'},
        lastName: {type: 'string'},
        email: {type: 'string'}
      }
    });
    const props = {
      schema,
      formName: 'test-form',
      path: 'user',
      config: Map(),
      isRequired: true,
      locale: 'pt-br'
    };
    const tree = renderer.render(<ObjectField {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders with configured order', () => {
    const schema = fromJS({
      type: 'object',
      properties: {
        firstName: {type: 'string'},
        lastName: {type: 'string'},
        email: {type: 'string'}
      },
      required: ['email']
    });
    const props = {
      schema,
      formName: 'test-form',
      path: 'user',
      config: fromJS({
        order: ['email', 'firstName', 'lastName']
      }),
      locale: 'pt-br'
    };
    const tree = renderer.render(<ObjectField {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders with empty order', () => {
    const schema = fromJS({
      type: 'object',
      properties: {
        firstName: {type: 'string'},
        lastName: {type: 'string'},
        email: {type: 'string'}
      },
      required: ['email']
    });
    const props = {
      schema,
      formName: 'test-form',
      path: 'user',
      config: fromJS({
        order: []
      }),
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
    const schema = fromJS({
      type: 'object',
      properties: {
        firstName: {type: 'string'},
        lastName: {type: 'string'},
        email: {type: 'string'}
      },
      required: ['email']
    });
    const props = {
      schema,
      formName: 'test-form',
      path: 'user',
      config: fromJS({
        order: ['email', 'bogus', 'firstName', 'lastName']
      }),
      locale: 'pt-br'
    };
    const tree = renderer.render(<ObjectField {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders emptyObject widget', () => {
    const schema = fromJS({
      type: 'object',
      properties: {}
    });
    const props = {
      schema,
      widgets: {
        emptyObject: 'EmptyObject'
      },
      formName: 'test-form',
      path: 'user',
      config: fromJS({}),
      locale: 'pt-br',
      context: {}
    };
    const tree = renderer.render(<ObjectField {...props} />);
    expect(tree).toMatchSnapshot();
  });
});
