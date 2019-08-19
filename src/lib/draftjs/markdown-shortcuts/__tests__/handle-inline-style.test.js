import Draft, {EditorState, SelectionState} from 'draft-js';
import handleInlineStyle from '../handle-inline-style';

test('handleInlineStyle - code', () => {
  const currentSelectionState = new SelectionState({
    anchorKey: 'item1',
    anchorOffset: 0,
    focusKey: 'item1',
    focusOffset: 0,
    isBackward: false,
    hasFocus: true
  });

  const newRawContentState = {
    entityMap: {},
    blocks: [
      {
        key: 'item1',
        text: '`hello`',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {}
      }
    ]
  };

  const contentState = Draft.convertFromRaw(newRawContentState);
  const currentEditorState = EditorState.forceSelection(
    EditorState.createWithContent(contentState),
    currentSelectionState
  );

  const newState = handleInlineStyle(currentEditorState);
  const currentContent = newState.getCurrentContent();
  const selection = newState.getSelection();
  const key = selection.getStartKey();
  const blockMap = currentContent.getBlockMap();
  const block = blockMap.get(key);
  const characterList = block.getCharacterList();

  expect(
    characterList
      .get(0)
      .getStyle()
      .has('CODE')
  ).toBe(true);
  expect(
    characterList
      .get(1)
      .getStyle()
      .has('CODE')
  ).toBe(true);
  expect(
    characterList
      .get(2)
      .getStyle()
      .has('CODE')
  ).toBe(true);
  expect(
    characterList
      .get(3)
      .getStyle()
      .has('CODE')
  ).toBe(true);
  expect(
    characterList
      .get(4)
      .getStyle()
      .has('CODE')
  ).toBe(true);
});

test('handleInlineStyle - code after unstyled text', () => {
  const currentSelectionState = new SelectionState({
    anchorKey: 'item1',
    anchorOffset: 0,
    focusKey: 'item1',
    focusOffset: 0,
    isBackward: false,
    hasFocus: true
  });

  const newRawContentState = {
    entityMap: {},
    blocks: [
      {
        key: 'item1',
        text: 'This is `code`',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {}
      }
    ]
  };

  const contentState = Draft.convertFromRaw(newRawContentState);
  const currentEditorState = EditorState.forceSelection(
    EditorState.createWithContent(contentState),
    currentSelectionState
  );

  const newState = handleInlineStyle(currentEditorState);
  const currentContent = newState.getCurrentContent();
  const selection = newState.getSelection();
  const key = selection.getStartKey();
  const blockMap = currentContent.getBlockMap();
  const block = blockMap.get(key);
  const characterList = block.getCharacterList();

  expect(
    characterList
      .get(0)
      .getStyle()
      .isEmpty()
  ).toBe(true);
  expect(
    characterList
      .get(1)
      .getStyle()
      .isEmpty()
  ).toBe(true);
  expect(
    characterList
      .get(2)
      .getStyle()
      .isEmpty()
  ).toBe(true);
  expect(
    characterList
      .get(3)
      .getStyle()
      .isEmpty()
  ).toBe(true);
  expect(
    characterList
      .get(4)
      .getStyle()
      .isEmpty()
  ).toBe(true);
  expect(
    characterList
      .get(5)
      .getStyle()
      .isEmpty()
  ).toBe(true);
  expect(
    characterList
      .get(6)
      .getStyle()
      .isEmpty()
  ).toBe(true);
  expect(
    characterList
      .get(7)
      .getStyle()
      .isEmpty()
  ).toBe(true);
  expect(
    characterList
      .get(8)
      .getStyle()
      .has('CODE')
  ).toBe(true);
  expect(
    characterList
      .get(9)
      .getStyle()
      .has('CODE')
  ).toBe(true);
  expect(
    characterList
      .get(10)
      .getStyle()
      .has('CODE')
  ).toBe(true);
  expect(
    characterList
      .get(11)
      .getStyle()
      .has('CODE')
  ).toBe(true);
});
