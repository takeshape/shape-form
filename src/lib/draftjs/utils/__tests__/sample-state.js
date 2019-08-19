import Immutable, {OrderedSet} from 'immutable';
import {BlockMapBuilder, CharacterMetadata, ContentBlock, ContentState, EditorState, SelectionState} from 'draft-js';

const BOLD = OrderedSet.of('BOLD');
const ITALIC = OrderedSet.of('ITALIC');
const ENTITY_KEY = '123';

const BLOCKS = [
  new ContentBlock({
    key: 'a',
    type: 'unstyled',
    text: 'Alpha',
    characterList: Immutable.List(Immutable.Repeat(CharacterMetadata.EMPTY, 5))
  }),
  new ContentBlock({
    key: 'b',
    type: 'unordered-list-item',
    text: 'Bravo',
    characterList: Immutable.List(Immutable.Repeat(CharacterMetadata.create({style: BOLD, entity: ENTITY_KEY}), 5))
  }),
  new ContentBlock({
    key: 'c',
    type: 'blockquote',
    text: 'Charlie',
    characterList: Immutable.List(Immutable.Repeat(CharacterMetadata.create({style: ITALIC, entity: null}), 7))
  })
];

const selectionState = new SelectionState({
  anchorKey: 'a',
  anchorOffset: 0,
  focusKey: 'a',
  focusOffset: 0,
  isBackward: false,
  hasFocus: true
});

const blockMap = BlockMapBuilder.createFromArray(BLOCKS);
const contentState = new ContentState({
  blockMap,
  entityMap: Immutable.OrderedMap(),
  selectionBefore: selectionState,
  selectionAfter: selectionState
});

let editorState = EditorState.createWithContent(contentState);
editorState = EditorState.forceSelection(editorState, selectionState);

export default function getSampleStateForTesting() {
  return {editorState, contentState, selectionState};
}
