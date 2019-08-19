jest.mock('../../../decorators/drop-target', () => x => x);
import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
const renderer = new ReactShallowRenderer();

import DropTarget from '../drop-target';
import {mount} from 'enzyme';

const props = {
  count: 0,
  connectDropTarget: x => x,
  className: 'customClass',
  children: 'drag items here'
};

describe('DropTarget', () => {
  it('renders', () => {
    const tree = renderer.render(<DropTarget {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('sets domNode for use in dnd', () => {
    const wrapper = mount(<DropTarget {...props} />);
    expect(wrapper.instance().domNode).toBeTruthy();
  });
});
