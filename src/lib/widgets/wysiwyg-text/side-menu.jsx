import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import ImageButton from '../../../draftjs/image/components/image-button';
import OembedButton from '../../../draftjs/oembed/oembed/components/oembed-button';
import BlockTypeSelect from 'app/common/draftjs/side-toolbar/block-type-select';
import {CodeBlockButton} from '../../../draftjs/buttons';
import HorizontalRuleButton from '../../../draftjs/section-break/components/section-break-button';

export default class DefaultBlockTypeSelect extends PureComponent {
  static propTypes = {
    editorState: PropTypes.object.isRequired,
    setEditorState: PropTypes.func.isRequired,
    theme: PropTypes.object
  };
  render() {
    const {editorState, setEditorState, theme} = this.props;
    return (
      <BlockTypeSelect
        editorState={editorState}
        setEditorState={setEditorState}
        theme={theme}
        structure={[ImageButton, OembedButton, CodeBlockButton, HorizontalRuleButton]}
      />
    );
  }
}
