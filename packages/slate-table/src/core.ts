import { Editor, Transforms, Range, Point, Element as SlateElement } from 'slate';

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

export const isBlockActive = (editor: Editor, format: string) => {
  const [match] = Editor.nodes(editor, {
    match: elem => {
      if (Editor.isEditor(elem)) return false;
      if (!SlateElement.isElement(elem)) return false;
      return elem.type === format;
    },
  });

  return !!match;
};

export const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: elem => {
      if (Editor.isEditor(elem)) return false;
      if (!SlateElement.isElement(elem)) return false;
      return LIST_TYPES.includes(elem.type as string);
    },
    split: true,
  });

  const newProperties = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  };

  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

export const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export const countRowCol = table => {
  const rcount = table.children.length;
  const ccount = rcount > 0 ? table.children[0].children.length : 0;

  return [rcount, ccount];
};

export const getContext = editor => {
  const { selection, data } = editor;
  const { slate } = data;
  const table = slate[0];

  const [rcount, ccount] = countRowCol(table);

  let row;
  let rowPath;
  let cell;
  let cellPath;

  if (selection) {
    const [_row] = Editor.nodes(editor, {
      match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'table-row',
    });

    const [_cell] = Editor.nodes(editor, {
      match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'table-cell',
    });

    if (_cell) {
      cell = _cell;
      const [, _cellPath] = _cell;
      cellPath = _cellPath;
    }

    if (_row) {
      row = _row;
      const [, _rowPath] = _row;
      rowPath = _rowPath;
    }
  }

  return { selection, rcount, ccount, cell, cellPath, row, rowPath };
};

export const withTables = (editor: Editor) => {
  const { deleteBackward, deleteForward, insertBreak } = editor;

  editor.addParagraph = () => {
    const { selection } = editor;

    if (selection) {
      const [cell] = Editor.nodes(editor, {
        match: n =>
          !Editor.isEditor(n) && SlateElement.isElement(n) && (n.type === 'paragraph' || n.type === 'list-item'),
      });

      if (cell) {
        const [node] = cell;
        editor.insertNode({ type: node.type, children: [{ text: '' }] });
      }
    }
  };

  editor.deleteBackward = unit => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [cell] = Editor.nodes(editor, {
        match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'table-cell',
      });

      if (cell) {
        const [, cellPath] = cell;
        const start = Editor.start(editor, cellPath);

        if (Point.equals(selection.anchor, start)) {
          return;
        }
      }
    }

    deleteBackward(unit);
  };

  editor.deleteForward = unit => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [cell] = Editor.nodes(editor, {
        match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'table-cell',
      });

      if (cell) {
        const [, cellPath] = cell;
        const end = Editor.end(editor, cellPath);

        if (Point.equals(selection.anchor, end)) {
          return;
        }
      }
    }

    deleteForward(unit);
  };

  editor.insertBreak = () => {
    const { selection } = editor;

    if (selection) {
      const [table] = Editor.nodes(editor, {
        match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'table',
      });

      if (table) {
        return;
      }
    }

    insertBreak();
  };

  return editor;
};

export default {
  toggleBlock,
  toggleMark,
  isBlockActive,
  isMarkActive,
  getContext,
  withTables,
};
