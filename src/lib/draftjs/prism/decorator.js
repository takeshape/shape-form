import Immutable from 'immutable';
import Prism from 'prismjs';
import 'prismjs/components/prism-twig';
import 'prismjs/components/prism-django';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-graphql';
import 'prismjs/components/prism-sass';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import PrismOptions from './options';
import flattenTokens from './flatten-tokens';

function PrismDecorator(options) {
  this.options = PrismOptions(options || {});
  this.highlighted = {};
}

/**
 * Return list of decoration IDs per character
 *
 * @param {ContentBlock}
 * @return {List<String>}
 */
PrismDecorator.prototype.getDecorations = function(block) {
  let tokens;
  let token;
  let tokenId;
  let resultId;
  let offset = 0;
  const filter = this.options.get('filter');
  const blockKey = block.getKey();
  const blockText = block.getText();
  const decorations = Array(blockText.length).fill(null);

  this.highlighted[blockKey] = {};

  if (!filter(block)) {
    return Immutable.List(decorations);
  }

  const syntax = block.getData().get('lang') || this.options.get('defaultSyntax');

  // Allow for no syntax highlighting
  if (syntax === null) {
    return Immutable.List(decorations);
  }

  // Parse text using Prism
  const grammar = Prism.languages[syntax];
  tokens = Prism.tokenize(blockText, grammar);
  tokens = flattenTokens(tokens, []);
  for (let i = 0; i < tokens.length; i++) {
    token = tokens[i];

    if (typeof token === 'string') {
      offset += token.length;
    } else {
      tokenId = 'tok' + offset;
      resultId = blockKey + '-' + tokenId;

      this.highlighted[blockKey][tokenId] = token;

      occupySlice(decorations, offset, offset + token.content.length, resultId);
      offset += token.content.length;
    }
  }

  return Immutable.List(decorations);
};

/**
 * Return component to render a decoration
 *
 * @param {String}
 * @return {Function}
 */
PrismDecorator.prototype.getComponentForKey = function() {
  return this.options.get('render');
};

/**
 * Return props to render a decoration
 *
 * @param {String}
 * @return {Object}
 */
PrismDecorator.prototype.getPropsForKey = function(key) {
  const parts = key.split('-');
  const blockKey = parts[0];
  const tokId = parts[1];
  const token = this.highlighted[blockKey][tokId];

  if (token) {
    return {
      type: token.type
    };
  }
};

function occupySlice(targetArr, start, end, componentKey) {
  for (let ii = start; ii < end; ii++) {
    targetArr[ii] = componentKey;
  }
}

export default PrismDecorator;
