import Immutable from 'immutable';
import Highlight from './components/highlight';

/**
 Filter block to only highlight code blocks

 @param {Draft.ContentBlock}
 @return {Boolean}
 */
function defaultFilter(block) {
  return block.getType() === 'code-block';
}

const PrismOptions = Immutable.Record({
  // Default language to use
  defaultSyntax: null,

  // Filter block before highlighting
  filter: defaultFilter,

  // Render a decorated text for a token
  render: Highlight
});

export default PrismOptions;
