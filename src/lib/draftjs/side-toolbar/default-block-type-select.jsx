import PropTypes from 'prop-types';
import React from 'react';
import BlockTypeSelect from './block-type-select';

import {
  CodeBlockButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton
} from '../buttons';

const DefaultBlockTypeSelect = ({editorState, setEditorState, theme}) => (
  <BlockTypeSelect
    editorState={editorState}
    setEditorState={setEditorState}
    theme={theme}
    structure={[
      HeadlineOneButton,
      HeadlineTwoButton,
      UnorderedListButton,
      OrderedListButton,
      BlockquoteButton,
      CodeBlockButton
    ]}
  />
);

DefaultBlockTypeSelect.propTypes = {
  theme: PropTypes.object,
  editorState: PropTypes.object.isRequired,
  setEditorState: PropTypes.func.isRequired
};

export default DefaultBlockTypeSelect;
