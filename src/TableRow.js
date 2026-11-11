import React from 'react';
import TableCell from './TableCell';
import { getRowData } from './cellHandle';
import { columnKey, ROW_HEADER_WIDTH } from './layout';
import styles from '../styles/table-row-styles';

const { memo, useRef, useEffect, useReducer, useSyncExternalStore } = React;

/** Subscribes the row to the part of the table state that concerns it.
 *  Snapshots are primitives, so unrelated rows are not re-rendered.
 */
function useRowState(store, rowIndex) {
  const activeCol = useSyncExternalStore(store.subscribe, () => {
    const s = store.getState();
    return s.activeRow === rowIndex ? s.activeCol : -1;
  });

  const selection = useSyncExternalStore(store.subscribe, () => {
    const sel = store.getState().selection;
    return sel && rowIndex >= sel.r0 && rowIndex <= sel.r1
      ? `${sel.c0}:${sel.c1}`
      : '';
  });

  const [c0, c1] = selection ? selection.split(':').map(Number) : [-1, -2];
  return { activeCol, c0, c1 };
}

function getErrors(record) {
  if (!record || typeof record.getErrors !== 'function') return [];
  const errors = record.getErrors();
  return Array.isArray(errors) ? errors.filter(Boolean) : [];
}

function DefaultRowHeading({ isActive, hasErrors, height }) {
  return (
    <div
      className='ft-row__heading-content'
      style={{
        height,
        borderLeft: isActive ? '3px solid #108ee9' : '3px solid transparent',
      }}
    >
      {hasErrors ? (
        <span style={{ color: '#f04134' }}>&#10006;</span>
      ) : (
        isActive && <span style={{ color: '#00a854' }}>&#10003;</span>
      )}
    </div>
  );
}

/** Re-renders when the record, the columns or a render callback change, when the
 *  record notifies a change (Record._subscribe) or when its active/selected state changes.
 */
function TableRow(props) {
  const {
    table,
    record,
    rowIndex,
    columns,
    fixedCount,
    headRowRender,
    type,
  } = props;
  const { store } = table;
  const { activeCol, c0, c1 } = useRowState(store, rowIndex);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  // stable handle given to records (Record._subscribe) and row controllers
  const handleRef = useRef(null);
  if (!handleRef.current) handleRef.current = {};
  const rowHandle = handleRef.current;
  rowHandle.forceUpdate = forceUpdate;
  rowHandle.props = {
    row: record,
    index: rowIndex,
    rowId: record != null ? record.id : undefined,
  };

  useEffect(() => {
    if (record && typeof record._subscribe === 'function')
      record._subscribe(rowHandle);
  }, [record, rowHandle]);

  const controllerRef = useRef(null);
  const getRowController = () => {
    if (!controllerRef.current) {
      controllerRef.current = table
        .getTableController()
        .createRowController(rowHandle, record);
    }
    return controllerRef.current;
  };

  const isActive = activeCol !== -1;
  const rowData = getRowData(record);
  const errors = getErrors(record);
  const height = (record && record.forteHeight) || styles.selectHeight(type);

  const cells = columns.map((column, index) => {
    const name = column && typeof column === 'object' ? column.name : column;
    const columnErrors = errors.filter(e => e.column === name);

    return (
      <TableCell
        key={columnKey(column, index)}
        table={table}
        record={record}
        rowData={rowData}
        column={column}
        rowIndex={rowIndex}
        columnIndex={index}
        activeRow={isActive}
        isActive={index === activeCol}
        isSelected={index >= c0 && index <= c1}
        fixed={index < fixedCount}
        lastFixed={index === fixedCount - 1}
        errorText={
          columnErrors.length
            ? columnErrors.map(e => e.msg).join('\n')
            : undefined
        }
        getRowController={getRowController}
        cellRender={props.cellRender}
        cellStyle={props.cellStyle}
        cellClassName={props.cellClassName}
        model={props.model}
      />
    );
  });

  let className = 'ft-row';
  if (isActive) className += ' ft-row--active';
  if (c0 === 0 && c1 >= columns.length - 1) className += ' ft-row--selected';

  return (
    <div
      className={className}
      style={{ height }}
      data-ft-row={rowIndex}
      role='row'
      aria-selected={c1 >= 0}
    >
      <div
        className='ft-row__heading'
        style={{ width: ROW_HEADER_WIDTH }}
        onMouseDown={e => table.onRowHeadingMouseDown(rowIndex, e)}
        onMouseMove={() => table.onSelectionDragMove(rowIndex, 0)}
        onMouseUp={() => table.onSelectionDragEnd()}
      >
        {headRowRender ? (
          headRowRender(record)
        ) : (
          <DefaultRowHeading
            isActive={isActive}
            hasErrors={errors.length > 0}
            height={height}
          />
        )}
      </div>
      {cells}
    </div>
  );
}

export default memo(TableRow);
