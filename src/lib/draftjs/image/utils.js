import {ContentState, convertToRaw} from 'draft-js';
import isString from 'lodash/isString';

const emptyRawContent = convertToRaw(ContentState.createFromText(''));

export function formatRawContent(rawContent) {
  if (rawContent) {
    if (isString(rawContent)) {
      return convertToRaw(ContentState.createFromText(rawContent));
    }
    return rawContent;
  }
  return emptyRawContent;
}

export function rawContentHasText(content) {
  return content.blocks[0].text;
}
