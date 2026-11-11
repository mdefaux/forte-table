import React from 'react';
import ColumnHeader from './ColumnHeader';
import { columnKey, ROW_HEADER_WIDTH } from './layout';
import '../styles/table-header.css';

export default function TableHeader({
  table,
  columns,
  columnsWidth,
  fixedCount,
  headColRender,
  onColumnHeaderClick,
}) {
  return (
    <div className='ft-table--header--container' role='row'>
      <div
        className='ft-table--header--content'
        style={{ width: ROW_HEADER_WIDTH }}
      />
      {columns.map((column, index) => (
        <ColumnHeader
          key={columnKey(column, index)}
          index={index}
          column={column}
          columnWidth={columnsWidth[index]}
          fixed={index < fixedCount}
          lastFixed={index === fixedCount - 1}
          headColRender={headColRender}
          onColumnHeaderClick={onColumnHeaderClick}
          previewColumnWidth={table.previewColumnWidth}
          commitColumnWidth={table.commitColumnWidth}
        />
      ))}
    </div>
  );
}
