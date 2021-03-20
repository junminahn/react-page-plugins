import React, { useState, useCallback, useMemo, useContext } from 'react';
import isHotkey from 'is-hotkey';
import throttle from 'lodash/throttle';
import times from 'lodash/times';
import styled from 'styled-components';
import { Slate, Editable, withReact, useFocused, useSelected, useSlate } from 'slate-react';
import { Editor, Transforms, Range, Point, Descendant, createEditor, Element as SlateElement } from 'slate';
import { withHistory } from 'slate-history';
import { Element, Leaf } from './EditableComponents';
import {
  BlockButton,
  MarkButton,
  AddRowBottom,
  AddRowTop,
  AddColumnLeft,
  AddColumnRight,
  RemoveColumn,
  RemoveRow,
} from './MenuComponents';

import ColorPickerControl from './controls/ColorPickerField';
import ControlledRangeDisableAcross from './controls/ControlledRangeDisableAcross';

import { withTables, countRowCol } from './core';
import { emptyCell, emptyRow, emptyTable, getRow, addCell, addRow, cloneTable } from './table-builder';
import { EditableEdit, EditableReadOnly } from './StyledEditable';
import Spacer from './components/Spacer';
import Flexbox from './components/Flexbox';
import { createTheme, ThemeContext } from './theme';

const RangeWrapper = styled.div`
  height: 40px;
  padding: 10px;
  overflow: hidden;
`;

const throttleUpdate = throttle(
  (value, onChange) => {
    onChange(value);
  },
  500,
  { trailing: true }
);

const TableProvider = props => {
  const { nodeId, onChange, data, children } = props;
  const { slate, ...rest } = data;

  const [value, setValue] = useState(slate || []);
  const editor = useMemo(() => withTables(withHistory(withReact(createEditor()))), []);

  const handleChange = useCallback(
    val => {
      setValue(val);

      const table = val[0];

      const [rcount, ccount] = countRowCol(table);

      if (rest.columnWidth.length !== ccount) {
        const equalWidth = 100 / ccount;
        rest.columnWidth = times(ccount, v => equalWidth + equalWidth * v);
      }

      throttleUpdate({ slate: val, ...rest }, onChange);
    },
    [data]
  );

  return (
    <Slate {...props} editor={editor} value={value} onChange={handleChange}>
      {children}
    </Slate>
  );
};

const TableEditable = props => {
  const selected = useSelected();
  const focused = useFocused();
  const editor = useSlate();

  const { Button } = useContext(ThemeContext);

  const { data, readOnly, nodeId } = props;
  const { slate, ...rest } = data;

  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);
  const handleKeyDown = useCallback(event => {
    if (isHotkey('shift+enter', event)) {
      event.preventDefault();
      editor.insertText('\n');
      return true;
    }

    if (isHotkey('enter', event)) {
      event.preventDefault();
      (editor.addParagraph as Function)();
      return true;
    }

    return undefined;
  }, []);

  const StyledEditable = readOnly ? EditableReadOnly : EditableEdit;

  return (
    <>
      {!readOnly && (
        <>
          <Button.Group>
            <MarkButton format="bold" icon="bold" />
            <MarkButton format="italic" icon="italic" />
            <MarkButton format="underline" icon="underline" />
            <MarkButton format="code" icon="code" />
            <BlockButton format="heading-two" icon="heading" />
            <BlockButton format="block-quote" icon="double-quotes" />
            <BlockButton format="numbered-list" icon="list-ordered" />
            <BlockButton format="bulleted-list" icon="list-unordered" />
          </Button.Group>
          &nbsp;
          <Button.Group>
            <AddRowBottom />
            <AddRowTop />
            <AddColumnLeft />
            <AddColumnRight />
            <RemoveColumn />
            <RemoveRow />
          </Button.Group>
        </>
      )}
      <StyledEditable
        {...rest}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        readOnly={readOnly}
        onKeyDown={readOnly ? undefined : handleKeyDown}
      />
    </>
  );
};

const TableEditableMemo = React.memo(TableEditable);

const ControlComponent = ({ data, onChange }) => {
  return (
    <>
      <Flexbox>
        <div>
          <ColorPickerControl
            label="Header Color"
            initialValue={data.headerColor}
            onChange={headerColor => throttleUpdate({ headerColor }, onChange)}
          />
        </div>
        <Spacer width="10px" />
        <div>
          <ColorPickerControl
            label="Even Color"
            initialValue={data.evenColor}
            onChange={evenColor => throttleUpdate({ evenColor }, onChange)}
          />
        </div>
        <Spacer width="10px" />
        <div>
          <ColorPickerControl
            label="Odd Color"
            initialValue={data.oddColor}
            onChange={oddColor => throttleUpdate({ oddColor }, onChange)}
          />
        </div>
      </Flexbox>

      <Spacer height="5px" />

      <span>Column Widths (comma-separated)</span>
      <RangeWrapper>
        <ControlledRangeDisableAcross
          key={data.columnWidth?.length || 'randomkey'}
          initialValue={data.columnWidth}
          onChange={columnWidth => throttleUpdate({ columnWidth }, onChange)}
        />
      </RangeWrapper>
    </>
  );
};

const controls = {
  type: 'custom',
  dark: false,
  Component: React.memo(ControlComponent),
};

const createInitialData = () => {
  const row = 2;
  const column = 3;

  const table = cloneTable();
  addRow(table, row);

  for (let r = 0; r < row; r++) {
    const row = getRow(table, r);
    addCell(row, column);
  }

  const slate = [table];

  return {
    slate,
    headerColor: '#fff',
    evenColor: '#fff',
    oddColor: '#fff',
    columnWidth: [33.3, 66.6, 100],
  };
};

const unserialize = data => {
  if (!data.headerColor) data.headerColor = '#fff';
  if (!data.evenColor) data.evenColor = '#fff';
  if (!data.oddColor) data.oddColor = '#fff';

  if (Array.isArray(data.slate) && data.slate.length > 0) {
    const [rcount, ccount] = countRowCol(data.slate[0]);

    if (!data.columnWidth || data.columnWidth.length !== ccount) {
      const equalWidth = 100 / ccount;
      data.columnWidth = times(ccount, v => equalWidth + equalWidth * v);
    }
  } else {
    data.columnWidth = [];
  }

  return data;
};

export const tableId = 'slate/ajm/table';

interface tableProps {
  style?: any;
}
const createTablePlugin = (props: tableProps) => {
  const { style } = props || {};
  const { Button } = createTheme(style);

  return {
    id: tableId,
    title: 'Table',
    description: 'A Slate table',
    version: 0.1,
    allowClickInside: true,
    Provider: TableProvider,
    Renderer: props => (
      <ThemeContext.Provider value={{ Button }}>
        <TableEditableMemo {...props} />
      </ThemeContext.Provider>
    ),
    controls,
    createInitialData,
    unserialize,
  };
};

export default createTablePlugin;
