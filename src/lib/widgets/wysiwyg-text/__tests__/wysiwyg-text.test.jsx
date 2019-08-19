jest.mock('draftjs-conductor');
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import DraftJSWidget from '../wysiwyg-text';

import {registerCopySource, handleDraftEditorPastedText} from 'draftjs-conductor';

const renderer = new ShallowRenderer();
const render = renderer.render.bind(renderer);

describe('DraftJSWidget', () => {
  const basicProps = {
    value: {},
    onChangeSilent: jest.fn(),
    onBlur: jest.fn(),
    dispatch: jest.fn(),
    schema: {}
  };

  it('renders', () => {
    expect(render(<DraftJSWidget {...basicProps} />)).toMatchSnapshot();
  });

  it('renders when disabled', () => {
    expect(render(<DraftJSWidget {...basicProps} disabled />)).toMatchSnapshot();
  });

  it('handleChange', () => {
    const widget = new DraftJSWidget(basicProps);
    const editorState = {value: 'newThing'};
    widget.handleChange(editorState);
    expect(basicProps.onChangeSilent).toHaveBeenCalledWith(editorState);
  });

  it('setReadOnly', () => {
    const widget = new DraftJSWidget(basicProps);
    const setState = (widget.setState = jest.fn());
    widget.setReadOnly(true);
    expect(setState).toHaveBeenCalledWith({readOnly: true});
    widget.setReadOnly(false);
    expect(setState).toHaveBeenCalledWith({readOnly: false});
  });

  it('componentDidMount', () => {
    const widget = new DraftJSWidget(basicProps);
    const editorRef = {editor: {addEventListener: jest.fn()}};
    widget.editor = {getEditorRef: () => editorRef};
    widget.componentDidMount();
    expect(registerCopySource).toHaveBeenCalledWith(editorRef);
  });

  it('componentWillUnmount', () => {
    const widget = new DraftJSWidget(basicProps);
    const unregister = jest.fn();
    widget.copySource = {unregister};
    widget.componentWillUnmount();
    expect(unregister).toHaveBeenCalledTimes(1);
  });

  it('componentWillUnmount - no copy source', () => {
    const widget = new DraftJSWidget(basicProps);
    widget.componentWillUnmount();
  });

  it('handlePastedText', () => {
    const html = 'html';
    const text = 'text';
    const state = {foo: 'bar'};
    const newState = {foo: 'baz'};

    handleDraftEditorPastedText.mockReturnValueOnce(newState);

    const widget = new DraftJSWidget(basicProps);

    expect(widget.handlePastedText(text, html, state)).toBe('handled');
    expect(widget.handlePastedText(text, html, state)).toBe('not-handled');
  });
});
