import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
const renderer = new ReactShallowRenderer();
import DefaultContentPreview from '../default-content-preview';

describe('DefaultContentPreview', () => {
  it('renders string', () => {
    const props = {
      value: 'Andrew',
      schema: {type: 'string', title: 'Name'},
      config: {}
    };

    const tree = renderer.render(<DefaultContentPreview {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders number', () => {
    const props = {
      value: 7,
      schema: {type: 'number', title: 'Lucky Number'},
      config: {}
    };

    const tree = renderer.render(<DefaultContentPreview {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders object', () => {
    const props = {
      value: {
        email: 'andrew@takeshape.io',
        firstName: 'Andrew',
        lastName: 'Sprouse'
      },
      schema: {
        type: 'object',
        properties: {
          email: {type: 'string'},
          firstName: {type: 'string'},
          lastName: {type: 'string'}
        }
      },
      config: {}
    };

    const tree = renderer.render(<DefaultContentPreview {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders object with order config', () => {
    const props = {
      value: {
        email: 'andrew@takeshape.io',
        firstName: 'Andrew',
        lastName: 'Sprouse'
      },
      schema: {
        type: 'object',
        properties: {
          email: {type: 'string'},
          firstName: {type: 'string'},
          lastName: {type: 'string'}
        }
      },
      config: {order: ['lastName', 'firstName', 'email']}
    };

    const tree = renderer.render(<DefaultContentPreview {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders with no content', () => {
    const props = {
      value: {},
      schema: {
        type: 'object',
        properties: {
          email: {type: 'string'},
          firstName: {type: 'string'},
          lastName: {type: 'string'}
        }
      },
      config: {order: ['lastName', 'firstName', 'email']}
    };

    const tree = renderer.render(<DefaultContentPreview {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders object with long string', () => {
    const props = {
      value: {
        content:
          'Cronut knausgaard bespoke green juice kitsch. DIY lyft four loko ethical bespoke meggings quinoa tousled 3 wolf moon lomo.'
      },
      schema: {
        type: 'object',
        properties: {
          content: {type: 'string'}
        }
      },
      config: {}
    };

    const tree = renderer.render(<DefaultContentPreview {...props} />);
    expect(tree).toMatchSnapshot();
  });
});
