import React from 'react';
import SingleLineText from './single-line-text';

function ParagraphTextWidget(props) {
  return <SingleLineText multiline {...props} />;
}

ParagraphTextWidget.propTypes = SingleLineText.propTypes;

export default ParagraphTextWidget;
