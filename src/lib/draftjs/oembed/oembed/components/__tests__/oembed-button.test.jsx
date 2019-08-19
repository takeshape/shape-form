import {shallow} from 'enzyme/build';

jest.mock('app/project/selectors');
jest.mock('../../utils/api');
jest.mock('../../modifiers/add-oembed', () => (...args) => args);
jest.mock('react-toolbox/lib/button', () => ({IconButton: 'IconButton'}));
jest.mock('react-toolbox/lib/dialog', () => 'Dialog');
jest.mock('react-toolbox/lib/input', () => 'Input');

import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import oembed from '../../utils/api';
import {getCurrentProjectId} from 'app/project/selectors';
import {OembedButton, mapStateToProps, preventBubblingUp} from '../oembed-button';
import toJson from 'enzyme-to-json';

const renderer = new ReactShallowRenderer();

function getProps(props) {
  return {
    projectId: 'project-id',
    editorState: {__mockEditorState: true},
    setEditorState: jest.fn(),
    theme: {
      button: 'button',
      'button-icon': 'button-icon'
    },
    ...props
  };
}

function matchesSnapshot(wrapper, hint) {
  wrapper.update();
  expect(toJson(wrapper)).toMatchSnapshot(hint);
}

describe('OembedButton', () => {
  it('renders', () => {
    const props = getProps();

    const tree = renderer.render(<OembedButton {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('handles dialog', async () => {
    const props = getProps();

    const wrapper = shallow(<OembedButton {...props} />);
    const button = wrapper.instance();

    // show dialog
    button.handleToggle();
    matchesSnapshot(wrapper, 'show dialog');

    // no-op save
    await button.handleSave();

    // enter url
    button.handleChangeUrl('bogus');
    matchesSnapshot(wrapper, 'enter url');

    oembed.mockReturnValueOnce(Promise.reject(new Error('bogus is not a URL')));

    // attempt to save invalid url
    await button.handleSave();
    matchesSnapshot(wrapper, 'save error');

    const html = '<div/>';
    oembed.mockReturnValueOnce(Promise.resolve({data: {html}}));

    // attempt to save valid url
    const url = 'https://www.google.com';
    button.handleChangeUrl(url);
    await button.handleSave();

    matchesSnapshot(wrapper, 'save success');
    expect(props.setEditorState).toHaveBeenCalledWith([props.editorState, {url, html}]);
  });
});

test('preventBubblingUp', () => {
  const mockEvent = {preventDefault: jest.fn()};
  preventBubblingUp(mockEvent);
  expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
});

test('mapStateToProps', () => {
  const projectId = 'project-id-123';
  getCurrentProjectId.mockReturnValueOnce(projectId);
  expect(mapStateToProps({})).toEqual({projectId});
});
