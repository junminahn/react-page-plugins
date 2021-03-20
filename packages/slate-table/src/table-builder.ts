import cloneDeep from 'lodash/cloneDeep';

export const emptyCell = {
  type: 'table-cell',
  children: [{ type: 'paragraph', children: [{ text: '' }] }],
};

export const emptyRow = {
  type: 'table-row',
  children: [],
};

export const emptyTable = {
  type: 'table',
  children: [],
};

export const getRow = (table, rindex) => {
  return table.children[rindex];
};

export const addCell = (row, cnt = 1) => {
  for (let x = 0; x < cnt; x++) {
    row.children.push(cloneDeep(emptyCell));
  }

  return row;
};

export const addRow = (table, cnt = 1) => {
  for (let x = 0; x < cnt; x++) {
    table.children.push(cloneDeep(emptyRow));
  }

  return table;
};

export const newCell = () => {
  return cloneDeep(emptyCell);
};

export const newRow = colWidth => {
  const newrow = cloneDeep(emptyRow);
  return addCell(newrow, colWidth);
};

export const cloneTable = () => {
  return cloneDeep(emptyTable);
};

export default {
  emptyCell,
  emptyRow,
  emptyTable,
  getRow,
  addCell,
  addRow,
  newCell,
  newRow,
  cloneTable,
};
