import React from 'react';
import AvatarDropdownItem from '../avatar-dropdown-item';

import ReactShallowRenderer from 'react-test-renderer/shallow';
const renderer = new ReactShallowRenderer();

describe('Avatar DropdownItem', () => {
  it('renders', () => {
    const props = {
      name: 'Name'
    };
    expect(renderer.render(<AvatarDropdownItem {...props} />)).toMatchSnapshot();
  });

  it('renders with avatar', () => {
    const props = {
      name: 'Name',
      avatar: '/path/to/avatar/image'
    };
    expect(renderer.render(<AvatarDropdownItem {...props} />)).toMatchSnapshot();
  });
});
