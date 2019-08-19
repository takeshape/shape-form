import Draft, {EditorState, SelectionState} from 'draft-js';
import handleBlockType from '../handle-block-type';

test('handleBlockType - dash', () => {
  const currentSelectionState = new SelectionState({
    anchorKey: 'item1',
    anchorOffset: 1,
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
        text: '-Samy',
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

  const newState = handleBlockType(currentEditorState);
  const currentContent = newState.getCurrentContent();
  const selection = newState.getSelection();
  const key = selection.getStartKey();
  const blockMap = currentContent.getBlockMap();
  const block = blockMap.get(key);
  const text = block.getText();
  const type = block.getType();

  expect(text).toBe('Samy');
  expect(type).toBe('unordered-list-item');
});

test('handleBlockType - dash - cursor not directly after special character', () => {
  const currentSelectionState = new SelectionState({
    anchorKey: 'item1',
    anchorOffset: 5,
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
        text: '-Samy',
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

  const newState = handleBlockType(currentEditorState);
  const currentContent = newState.getCurrentContent();
  const selection = newState.getSelection();
  const key = selection.getStartKey();
  const blockMap = currentContent.getBlockMap();
  const block = blockMap.get(key);
  const text = block.getText();
  const type = block.getType();

  expect(text).toBe('-Samy');
  expect(type).toBe('unstyled');
});

test('handleBlockType - asterisk', () => {
  const currentSelectionState = new SelectionState({
    anchorKey: 'item1',
    anchorOffset: 1,
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
        text: '*Pesse',
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

  const newState = handleBlockType(currentEditorState);
  const currentContent = newState.getCurrentContent();
  const selection = newState.getSelection();
  const key = selection.getStartKey();
  const blockMap = currentContent.getBlockMap();
  const block = blockMap.get(key);
  const text = block.getText();
  const type = block.getType();

  expect(text).toBe('Pesse');
  expect(type).toBe('unordered-list-item');
});

test('handleBlockType - single digit number', () => {
  const currentSelectionState = new SelectionState({
    anchorKey: 'item1',
    anchorOffset: 2,
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
        text: '1.foo',
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

  const newState = handleBlockType(currentEditorState);
  const currentContent = newState.getCurrentContent();
  const selection = newState.getSelection();
  const key = selection.getStartKey();
  const blockMap = currentContent.getBlockMap();
  const block = blockMap.get(key);
  const text = block.getText();
  const type = block.getType();

  expect(text).toBe('foo');
  expect(type).toBe('ordered-list-item');
});

test('handleBlockType - single digit number - cursor not directly after special character', () => {
  const currentSelectionState = new SelectionState({
    anchorKey: 'item1',
    anchorOffset: 5,
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
        text: '1.foo',
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

  const newState = handleBlockType(currentEditorState);
  const currentContent = newState.getCurrentContent();
  const selection = newState.getSelection();
  const key = selection.getStartKey();
  const blockMap = currentContent.getBlockMap();
  const block = blockMap.get(key);
  const text = block.getText();
  const type = block.getType();

  expect(text).toBe('1.foo');
  expect(type).toBe('unstyled');
});

test('handleBlockType - multiple digit number', () => {
  const currentSelectionState = new SelectionState({
    anchorKey: 'item1',
    anchorOffset: 4,
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
        text: '999.bar',
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

  const newState = handleBlockType(currentEditorState);
  const currentContent = newState.getCurrentContent();
  const selection = newState.getSelection();
  const key = selection.getStartKey();
  const blockMap = currentContent.getBlockMap();
  const block = blockMap.get(key);
  const text = block.getText();
  const type = block.getType();

  expect(text).toBe('bar');
  expect(type).toBe('ordered-list-item');
});

test('handleBlockType - multiple digit number - cursor not directly after special character', () => {
  const currentSelectionState = new SelectionState({
    anchorKey: 'item1',
    anchorOffset: 7,
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
        text: '999.bar',
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

  const newState = handleBlockType(currentEditorState);
  const currentContent = newState.getCurrentContent();
  const selection = newState.getSelection();
  const key = selection.getStartKey();
  const blockMap = currentContent.getBlockMap();
  const block = blockMap.get(key);
  const text = block.getText();
  const type = block.getType();

  expect(text).toBe('999.bar');
  expect(type).toBe('unstyled');
});

test('handleBlockType - greater than', () => {
  const currentSelectionState = new SelectionState({
    anchorKey: 'item1',
    anchorOffset: 1,
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
        text: '>One thing only I know, and that is that I know nothing.',
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

  const newState = handleBlockType(currentEditorState);
  const currentContent = newState.getCurrentContent();
  const selection = newState.getSelection();
  const key = selection.getStartKey();
  const blockMap = currentContent.getBlockMap();
  const block = blockMap.get(key);
  const text = block.getText();
  const type = block.getType();

  expect(text).toBe('One thing only I know, and that is that I know nothing.');
  expect(type).toBe('blockquote');
});

test('handleBlockType - preserve characterList indices', () => {
  const currentSelectionState = new SelectionState({
    anchorKey: 'item1',
    anchorOffset: 1,
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
        text: '-dare to be bold',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [
          {
            offset: 12,
            length: 4,
            style: 'BOLD'
          }
        ],
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

  const newState = handleBlockType(currentEditorState);
  const currentContent = newState.getCurrentContent();
  const selection = newState.getSelection();
  const key = selection.getStartKey();
  const blockMap = currentContent.getBlockMap();
  const block = blockMap.get(key);
  const characterList = block.getCharacterList();

  expect(characterList.size).toBe(15);
  expect(
    characterList
      .get(11)
      .getStyle()
      .has('BOLD')
  ).toBe(true);
  expect(
    characterList
      .get(12)
      .getStyle()
      .has('BOLD')
  ).toBe(true);
  expect(
    characterList
      .get(13)
      .getStyle()
      .has('BOLD')
  ).toBe(true);
  expect(
    characterList
      .get(14)
      .getStyle()
      .has('BOLD')
  ).toBe(true);
});

test('handleBlockType - preserve characterList indices when regex is multi digit number', () => {
  const currentSelectionState = new SelectionState({
    anchorKey: 'item1',
    anchorOffset: 6,
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
        text: '74443.ooh the word italics is in italics',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [
          {
            offset: 19,
            length: 7,
            style: 'ITALICS'
          }
        ],
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

  const newState = handleBlockType(currentEditorState);
  const currentContent = newState.getCurrentContent();
  const selection = newState.getSelection();
  const key = selection.getStartKey();
  const blockMap = currentContent.getBlockMap();
  const block = blockMap.get(key);
  const characterList = block.getCharacterList();

  expect(characterList.size).toBe(34);
  expect(
    characterList
      .get(13)
      .getStyle()
      .has('ITALICS')
  ).toBe(true);
  expect(
    characterList
      .get(14)
      .getStyle()
      .has('ITALICS')
  ).toBe(true);
  expect(
    characterList
      .get(15)
      .getStyle()
      .has('ITALICS')
  ).toBe(true);
  expect(
    characterList
      .get(16)
      .getStyle()
      .has('ITALICS')
  ).toBe(true);
  expect(
    characterList
      .get(17)
      .getStyle()
      .has('ITALICS')
  ).toBe(true);
  expect(
    characterList
      .get(18)
      .getStyle()
      .has('ITALICS')
  ).toBe(true);
  expect(
    characterList
      .get(19)
      .getStyle()
      .has('ITALICS')
  ).toBe(true);
});

test('handleBlockType - one hashtag', () => {
  const currentSelectionState = new SelectionState({
    anchorKey: 'item1',
    anchorOffset: 1,
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
        text: '#Title',
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

  const newState = handleBlockType(currentEditorState);
  const currentContent = newState.getCurrentContent();
  const selection = newState.getSelection();
  const key = selection.getStartKey();
  const blockMap = currentContent.getBlockMap();
  const block = blockMap.get(key);
  const text = block.getText();
  const type = block.getType();

  expect(text).toBe('Title');
  expect(type).toBe('header-one');
});

test('handleBlockType - one hashtag - cursor not directly after special character', () => {
  const currentSelectionState = new SelectionState({
    anchorKey: 'item1',
    anchorOffset: 6,
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
        text: '#Title',
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

  const newState = handleBlockType(currentEditorState);
  const currentContent = newState.getCurrentContent();
  const selection = newState.getSelection();
  const key = selection.getStartKey();
  const blockMap = currentContent.getBlockMap();
  const block = blockMap.get(key);
  const text = block.getText();
  const type = block.getType();

  expect(text).toBe('#Title');
  expect(type).toBe('unstyled');
});

test('handleBlockType - multiple hashtags', () => {
  const currentSelectionState = new SelectionState({
    anchorKey: 'item1',
    anchorOffset: 3,
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
        text: '###News Article',
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

  const newState = handleBlockType(currentEditorState);
  const currentContent = newState.getCurrentContent();
  const selection = newState.getSelection();
  const key = selection.getStartKey();
  const blockMap = currentContent.getBlockMap();
  const block = blockMap.get(key);
  const text = block.getText();
  const type = block.getType();

  expect(text).toBe('News Article');
  expect(type).toBe('header-three');
});

test('handleBlockType - multiple hashtags - cursor not directly after special character', () => {
  const currentSelectionState = new SelectionState({
    anchorKey: 'item1',
    anchorOffset: 15,
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
        text: '###News Article',
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

  const newState = handleBlockType(currentEditorState);
  const currentContent = newState.getCurrentContent();
  const selection = newState.getSelection();
  const key = selection.getStartKey();
  const blockMap = currentContent.getBlockMap();
  const block = blockMap.get(key);
  const text = block.getText();
  const type = block.getType();

  expect(text).toBe('###News Article');
  expect(type).toBe('unstyled');
});

test('handleBlockType - hashtags with text before', () => {
  const currentSelectionState = new SelectionState({
    anchorKey: 'item1',
    anchorOffset: 1,
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
        text: 'Hello ## World',
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

  const newState = handleBlockType(currentEditorState);
  const currentContent = newState.getCurrentContent();
  const selection = newState.getSelection();
  const key = selection.getStartKey();
  const blockMap = currentContent.getBlockMap();
  const block = blockMap.get(key);
  const text = block.getText();
  const type = block.getType();

  expect(text).toBe('Hello ## World');
  expect(type).toBe('unstyled');
});

test('handleBlockType - hashtags with text between', () => {
  const currentSelectionState = new SelectionState({
    anchorKey: 'item1',
    anchorOffset: 4,
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
        text: '####Article Title ##',
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

  const newState = handleBlockType(currentEditorState);
  const currentContent = newState.getCurrentContent();
  const selection = newState.getSelection();
  const key = selection.getStartKey();
  const blockMap = currentContent.getBlockMap();
  const block = blockMap.get(key);
  const text = block.getText();
  const type = block.getType();

  expect(text).toBe('Article Title ##');
  expect(type).toBe('header-four');
});
