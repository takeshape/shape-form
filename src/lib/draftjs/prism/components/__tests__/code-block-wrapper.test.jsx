import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import CodeBlockWrapper from '../code-block-wrapper';

import {shallow} from 'enzyme';
const renderer = new ReactShallowRenderer();

function createProps() {
  const blockProps = {
    changeLang: jest.fn(),
    lang: 'javascript',
    setReadOnly: jest.fn()
  };

  return {
    blockProps
  };
}

describe('CodeBlockWrapper', () => {
  it('renders with lang', () => {
    const props = createProps();

    const tree = renderer.render(<CodeBlockWrapper {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders with no lang', () => {
    const props = createProps();
    props.blockProps.lang = null;

    const tree = renderer.render(<CodeBlockWrapper {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('handles disable editor', done => {
    const props = createProps();
    props.blockProps.setReadOnly = param => {
      expect(param).toBe(true);
      done();
    };

    const wrapper = shallow(<CodeBlockWrapper {...props} />);

    wrapper.instance().handleDisableEditor();
  });

  it('handles enable editor', done => {
    const props = createProps();
    props.blockProps.setReadOnly = param => {
      expect(param).toBe(false);
      done();
    };

    const wrapper = shallow(<CodeBlockWrapper {...props} />);

    wrapper.instance().handleEnableEditor();
  });
});
