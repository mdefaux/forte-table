import React, { useCallback, useMemo, useRef, useState } from 'react';
import ForteTable from '../../../src';
import { generateRecords } from '../../data/mockRecords';
import '../resources/data-grid-example.css';

const RECORDS = generateRecords(1000);

const COLUMNS = [
  { name: 'id', title: '#', type: 'integer', defaultColumnWidth: 60 },
  { name: 'lastName', title: 'Last name', defaultColumnWidth: 120 },
  { name: 'firstName', title: 'First name', defaultColumnWidth: 110 },
  { name: 'email', title: 'E-mail', defaultColumnWidth: 240 },
  { name: 'department', title: 'Department', defaultColumnWidth: 120 },
  { name: 'role', title: 'Role', defaultColumnWidth: 110 },
  { name: 'country', title: 'Country', defaultColumnWidth: 100 },
  { name: 'city', title: 'City', defaultColumnWidth: 100 },
  {
    name: 'hireDate',
    title: 'Hire date',
    type: 'date',
    defaultColumnWidth: 110,
  },
  {
    name: 'salary',
    title: 'Salary',
    type: 'currency',
    defaultColumnWidth: 110,
  },
  { name: 'bonus', title: 'Bonus', type: 'currency', defaultColumnWidth: 100 },
  {
    name: 'progress',
    title: 'Progress',
    type: 'progress',
    defaultColumnWidth: 140,
  },
  { name: 'rating', title: 'Rating', type: 'rating', defaultColumnWidth: 100 },
  { name: 'remote', title: 'Remote', type: 'boolean', defaultColumnWidth: 80 },
  { name: 'status', title: 'Status', type: 'status', defaultColumnWidth: 110 },
];

const NUMERIC = ['integer', 'currency', 'progress', 'rating'];

const currency = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});
const dateFormat = new Intl.DateTimeFormat('it-IT');

/** Cell rendering is delegated by the library to the application. */
function renderCell(column, row) {
  const value = row[column.name];

  switch (column.type) {
    case 'currency':
      return (
        <span className='dg-cell dg-cell--right'>{currency.format(value)}</span>
      );
    case 'integer':
      return <span className='dg-cell dg-cell--right'>{value}</span>;
    case 'date':
      return (
        <span className='dg-cell'>{dateFormat.format(new Date(value))}</span>
      );
    case 'progress':
      return (
        <span className='dg-cell dg-progress' title={`${value}%`}>
          <span className='dg-progress__bar' style={{ width: `${value}%` }} />
          <span className='dg-progress__label'>{value}%</span>
        </span>
      );
    case 'rating':
      return (
        <span className='dg-cell dg-rating'>
          {'\u2605'.repeat(value)}
          {'\u2606'.repeat(5 - value)}
        </span>
      );
    case 'boolean':
      return (
        <span className='dg-cell dg-cell--center'>{value ? '\u2714' : ''}</span>
      );
    case 'status':
      return (
        <span
          className={`dg-cell dg-status dg-status--${value
            .replace(/\s/g, '')
            .toLowerCase()}`}
        >
          {value}
        </span>
      );
    default:
      return <span className='dg-cell'>{value}</span>;
  }
}

function summarize(columns, rows) {
  if (!rows.length) return null;

  const stats = columns
    .filter(c => NUMERIC.includes(c.type))
    .map(c => {
      const values = rows.map(r => r[c.name]);
      const sum = values.reduce((a, v) => a + v, 0);
      const fmt =
        c.type === 'currency'
          ? v => currency.format(v)
          : v => Math.round(v * 100) / 100;
      return `${c.title}: sum ${fmt(sum)}, avg ${fmt(sum / values.length)}`;
    });

  return { rows: rows.length, columns: columns.length, stats };
}

export default function DataGridExample() {
  const tableRef = useRef(null);
  const [fixedCount, setFixedCount] = useState(2);
  const [columnWidths, setColumnWidths] = useState({});
  const [active, setActive] = useState(null);
  const [selection, setSelection] = useState(null);
  const [lastEvent, setLastEvent] = useState('');

  const rows = useCallback(() => RECORDS, []);
  const columns = useCallback(() => COLUMNS, []);

  // returns the stored width on render (width undefined) and stores it after a resize
  const onColumnWidth = useCallback(
    (width, column) => {
      if (width === undefined) return columnWidths[column.name];
      setColumnWidths(prev => ({ ...prev, [column.name]: width }));
      return width;
    },
    [columnWidths]
  );

  return (
    <div className='dg-example'>
      <div className='dg-toolbar'>
        <label>
          Fixed columns:{' '}
          <input
            type='number'
            min={0}
            max={COLUMNS.length}
            value={fixedCount}
            onChange={e =>
              setFixedCount(
                Math.max(
                  0,
                  Math.min(COLUMNS.length, Number(e.target.value) || 0)
                )
              )
            }
          />
        </label>
        <button
          onClick={() =>
            tableRef.current.selectRange(0, 0, COLUMNS.length - 1, 9)
          }
        >
          Select first 10 records
        </button>
        <button onClick={() => tableRef.current.clearSelection()}>
          Clear selection
        </button>
        <button onClick={() => setColumnWidths({})}>Reset column widths</button>
        <span className='dg-hint'>
          Drag over cells or row headings to select; Shift+click / Shift+arrows
          extend the selection; drag a header edge to resize a column.
        </span>
      </div>

      <ForteTable
        ref={tableRef}
        rows={rows}
        columns={columns}
        columnFixedCount={fixedCount}
        headColRender={column => column.title}
        cellRender={renderCell}
        onColumnWidth={onColumnWidth}
        setActiveCell={(cell, colIndex, rowIndex) =>
          setActive({ colIndex, rowIndex, column: cell.column, row: cell.row })
        }
        onCellSelectionChange={(cols, rs) => setSelection(summarize(cols, rs))}
        onCellDoubleClick={(e, column, row) =>
          setLastEvent(
            `Double click on ${row.firstName} ${row.lastName} / ${
              column.title
            }: ${row[column.name]}`
          )
        }
        onColumnHeaderClick={index =>
          setLastEvent(`Header click on column "${COLUMNS[index].title}"`)
        }
        style={{ height: 480, border: '1px solid #dde1e3' }}
      />

      <div className='dg-status-bar'>
        <div>
          {RECORDS.length} records.{' '}
          {active &&
            `Active cell: row ${active.rowIndex + 1}, ${
              active.column.title
            } = ${active.row[active.column.name]}`}
        </div>
        {selection && (
          <div>
            Selection: {selection.rows} record(s) x {selection.columns}{' '}
            column(s)
            {selection.stats.map(s => (
              <div key={s} className='dg-stat'>
                {s}
              </div>
            ))}
          </div>
        )}
        {lastEvent && <div>{lastEvent}</div>}
      </div>
    </div>
  );
}
