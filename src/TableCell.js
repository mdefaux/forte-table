import React from 'react';
import { makeCellHandle } from './cellHandle';
import '../styles/table-cell.css';

const { useRef } = React;

function defaultContent(column, row) {
  if (row === null || typeof row !== 'object') return ' ';
  const key = column && typeof column === 'object' ? column.name : column;
  const value = row[key];
  return value == null || typeof value === 'object' ? ' ' : String(value);
}

export default function TableCell(props) {
  const {
    table,
    record,
    rowData,
    column,
    rowIndex,
    columnIndex,
    activeRow,
    isActive,
    isSelected,
    fixed,
    lastFixed,
    errorText,
    getRowController,
    cellRender,
    cellStyle,
    cellClassName,
    model,
  } = props;
  const controllerRef = useRef(null);

  const cell = makeCellHandle({
    record,
    column,
    rowIndex,
    columnIndex,
    activeRow,
    isActive,
    isSelected,
    errorText,
    model,
    setActive: () => table.setActiveCell(rowIndex, columnIndex, cell),
    getController: () => {
      if (!controllerRef.current) {
        controllerRef.current = getRowController().createCellController(
          cell,
          rowData,
          column
        );
      }
      return controllerRef.current;
    },
  });

  // event callbacks are read from the latest table props: the cell may be memoized
  const forward = (name, e) => {
    const callback = table.getProps()[name];
    if (callback) callback(e, column, rowData, model, cell);
  };

  const onClick = e => {
    forward('onCellClick', e);
    // shift+click extends the selection: the active cell stays on the anchor
    if (!e.shiftKey) cell.props.setActive();
  };

  const onMouseDown = e => {
    if (e.button === 1) return;
    forward('onCellMouseDown', e);

    const extend = e.shiftKey && e.button === 0;
    table.onSelectionDragStart(rowIndex, columnIndex, extend);
    if (!extend) cell.props.setActive();
  };

  const onMouseMove = e => {
    forward('onCellMouseMove', e);
    table.onSelectionDragMove(rowIndex, columnIndex);
  };

  const onMouseUp = e => {
    forward('onCellMouseUp', e);
    table.onSelectionDragEnd(cell);
  };

  const content = cellRender
    ? cellRender(column, rowData, cell)
    : defaultContent(column, rowData);

  const noBorder = column && column.nobordercell;
  let className = 'ft-cell__container';
  if (!noBorder)
    className += isActive
      ? ' ft-cell__container--active'
      : ' ft-cell__container--normal';
  className += ' disable-selection';
  if (fixed) className += ' ft-fixed';
  if (lastFixed) className += ' ft-fixed--last';
  if (isSelected) className += ' ft-cell-selected';

  if (cellClassName)
    className = cellClassName(className, column, rowData, cell);

  let style = errorText ? { border: '1px solid red' } : {};
  if (cellStyle) style = cellStyle(style, column, rowData, cell) || style;

  style = {
    ...style,
    width: `var(--ft-w-${columnIndex})`,
    left: fixed ? `var(--ft-l-${columnIndex})` : style.left,
  };
  if (isSelected) style.backgroundColor = 'var(--ft-selection-bg, #BFBFFF)';

  return (
    <div
      className={className}
      title={errorText}
      style={style}
      data-ft-col={columnIndex}
      role='gridcell'
      aria-selected={isSelected}
      onClick={onClick}
      onDoubleClick={e => forward('onCellDoubleClick', e)}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onKeyDown={e => forward('onCellKeyDown', e)}
      onKeyUp={e => forward('onCellKeyUp', e)}
      draggable={false}
    >
      <div className='ft-cell__content'>{content}</div>
    </div>
  );
}
