import React, { useCallback, useMemo, useState, useContext } from 'react';
import startCase from 'lodash/startCase';
import { Slate, Editable, withReact, useFocused, useSelected, useSlate } from 'slate-react';
import { Editor, Transforms, createEditor, Descendant, Node, Element as SlateElement } from 'slate';

import { toggleBlock, toggleMark, isBlockActive, isMarkActive, getContext } from './core';

import { emptyCell, emptyRow, emptyTable, getRow, addCell, addRow, newCell, newRow, cloneTable } from './table-builder';
import { ThemeContext } from './theme';
import { Icon } from './icons';

const IconButton = props => {
  const { active, icon, ...rest } = props;
  const { Button } = useContext(ThemeContext);

  return (
    <Button {...rest} active={active} icon title={startCase(icon)}>
      <Icon disabled={!active} name={icon} />
    </Button>
  );
};

export const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  const isActive = isBlockActive(editor, format);

  return (
    <IconButton
      active={isActive}
      onMouseDown={event => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
      icon={icon}
    />
  );
};

export const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
  const isActive = isMarkActive(editor, format);

  return (
    <IconButton
      active={isActive}
      onMouseDown={event => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
      icon={icon}
    />
  );
};

export const AddRowBottom = () => {
  const editor = useSlate();

  return (
    <IconButton
      onMouseDown={event => {
        event.preventDefault();

        const { rcount, ccount, cell, cellPath, row, rowPath } = getContext(editor);

        let targetRow = rcount;

        if (row) {
          targetRow = rowPath[1] + 1;
        }

        Transforms.insertNodes(editor, newRow(ccount), {
          at: [0, targetRow],
          voids: true,
        });
      }}
      icon="insert-row-bottom"
    />
  );
};

export const AddRowTop = () => {
  const editor = useSlate();

  return (
    <IconButton
      icon="insert-row-top"
      onMouseDown={event => {
        event.preventDefault();

        const { rcount, ccount, cell, cellPath, row, rowPath } = getContext(editor);

        let targetRow = rcount;

        if (row) {
          targetRow = rowPath[1];
        }

        Transforms.insertNodes(editor, newRow(ccount), {
          at: [0, targetRow],
          voids: true,
        });
      }}
    />
  );
};

export const AddColumnLeft = () => {
  const editor = useSlate();

  return (
    <IconButton
      icon="insert-column-left"
      onMouseDown={event => {
        event.preventDefault();

        const { rcount, ccount, cell, cellPath, row, rowPath } = getContext(editor);
        let targetColumn = 0;

        if (cell) {
          targetColumn = cellPath[2];
        }

        for (let x = 0; x < rcount; x++) {
          Transforms.insertNodes(editor, newCell(), {
            at: [0, x, targetColumn],
            voids: true,
          });
        }
      }}
    />
  );
};

export const AddColumnRight = () => {
  const editor = useSlate();

  return (
    <IconButton
      icon="insert-column-right"
      onMouseDown={event => {
        event.preventDefault();

        const { rcount, ccount, cell, cellPath, row, rowPath } = getContext(editor);
        let targetColumn = 0;

        if (cell) {
          targetColumn = cellPath[2] + 1;
        }

        for (let x = 0; x < rcount; x++) {
          Transforms.insertNodes(editor, newCell(), {
            at: [0, x, targetColumn],
            voids: true,
          });
        }
      }}
    />
  );
};

export const RemoveColumn = () => {
  const editor = useSlate();
  const focused = useFocused();

  return (
    <IconButton
      icon="delete-column"
      disabled={!focused}
      onMouseDown={event => {
        event.preventDefault();

        const { rcount, ccount, cell, cellPath, row, rowPath } = getContext(editor);
        if (ccount === 1) return;

        let targetColumn = 0;

        if (cell) {
          targetColumn = cellPath[2];
        }

        for (let x = 0; x < rcount; x++) {
          Transforms.removeNodes(editor, { at: [0, x, targetColumn], voids: true });
        }
      }}
    />
  );
};

export const RemoveRow = () => {
  const editor = useSlate();
  const focused = useFocused();
  return (
    <IconButton
      icon="delete-row"
      disabled={!focused}
      onMouseDown={event => {
        event.preventDefault();

        const { rcount, ccount, cell, cellPath, row, rowPath } = getContext(editor);
        if (rcount === 1) return;

        let targetRow = 0;

        if (row) {
          targetRow = rowPath[1];
        }

        Transforms.removeNodes(editor, { at: [0, targetRow], voids: true });
      }}
    />
  );
};

export default {
  BlockButton,
  MarkButton,
  AddRowBottom,
  AddRowTop,
  AddColumnLeft,
  AddColumnRight,
  RemoveColumn,
  RemoveRow,
};
