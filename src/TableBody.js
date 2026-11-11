import React from 'react';
import TableRow from './TableRow';

export default function TableBody({ rows, ...rowProps }) {
  return (
    <div className='ft-table__body' role='rowgroup'>
      {rows.map((record, index) => (
        <TableRow key={index} record={record} rowIndex={index} {...rowProps} />
      ))}
    </div>
  );
}
