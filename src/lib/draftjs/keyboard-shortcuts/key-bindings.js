import {RichUtils} from 'draft-js';

export const bindings = {
  73: 'add-image',
  49: 'header-one',
  50: 'header-two',
  51: 'header-three',
  56: 'unordered-list-item',
  55: 'ordered-list-item',
  53: 'blockquote',
  188: 'code-block',
  189: 'section-break',
  190: 'code',
  83: 'small'
};

const blockStyleCommands = {
  'header-one': 'header-one',
  'header-two': 'header-two',
  'header-three': 'header-three',
  'unordered-list-item': 'unordered-list-item',
  'ordered-list-item': 'ordered-list-item',
  blockquote: 'blockquote',
  'code-block': 'code-block'
};

const inlineStyleCommands = {
  code: 'CODE',
  small: 'SMALL'
};

export function isSimpleCommand(command) {
  return blockStyleCommands[command] || inlineStyleCommands[command];
}

export function toggleSimpleCommand(command, editorState) {
  if (inlineStyleCommands[command]) {
    return RichUtils.toggleInlineStyle(editorState, inlineStyleCommands[command]);
  }
  return RichUtils.toggleBlockType(editorState, blockStyleCommands[command]);
}
