import styled from 'styled-components';
import { Editable } from 'slate-react';

const controlStyle = ({ headerColor = '#fff', evenColor = '#fff', oddColor = '#fff', columnWidth = [] }) => `
  & .table {
    & .table-row:nth-of-type(even) {
      background-color: ${evenColor};
    }
    & .table-row:nth-of-type(odd) {
      background-color: ${oddColor};
    }
    & .table-row:first-child {
      background-color: ${headerColor};
    }
    & .table-row {
      width: 100% !important;
      ${columnWidth.map((w, n) =>
        w
          ? `
              & .table-cell:nth-child(${n + 1}) { width:${n === 0 ? w : w - columnWidth[n - 1]}%; }
            `
          : ''
      )}
    }
  }
`;

const commonStyle = `
  & .table {
    width: 100%;
    background: #fff;
    margin: 1em 0em;
    border: 1px solid rgba(34, 36, 38, 0.15);
    -webkit-box-shadow: none;
    box-shadow: none;
    border-radius: 0.28571429rem;
    text-align: left;
    color: rgba(0, 0, 0, 0.87);
    font-size: 0.9em;
    flex-wrap: wrap;

    & .table-row {
      display: flex;

      & > .table-cell {
        padding: 0.78571429em 0.78571429em;
        border-top: 1px solid rgba(34, 36, 38, 0.1);
        border-left: 1px solid rgba(34, 36, 38, 0.1);
        border-right: 1px solid rgba(34, 36, 38, 0.1);
        box-sizing: border-box;
        // flex-grow: 1;
        // width: 10px;
        overflow: hidden;
      }
    }
  }
`;

export const EditableEdit = styled(Editable)`
  ${commonStyle}
  ${controlStyle}
`;

export const EditableReadOnly = styled(Editable)`
  ${commonStyle}
  ${controlStyle}
`;

export default { EditableEdit, EditableReadOnly };
