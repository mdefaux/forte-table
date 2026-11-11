import React from 'react';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import { createTableStore, toRect, sameRect } from './tableStore';
import {
  columnKey,
  columnVars,
  DEFAULT_COLUMN_WIDTH,
  MIN_COLUMN_WIDTH,
} from './layout';
import { makeCellHandle } from './cellHandle';
import '../styles/forte-table.css';

const {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useCallback,
  useMemo,
} = React;

const isEditable = target =>
  !!target &&
  (target.isContentEditable ||
    /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));

/** ForteTable displays a grid given a set of columns and a set of rows.
 *  Cells receive the column and the row data and delegate their content to `cellRender`.
 *
 *  Main props:
 *  - rows(): array of records; columns(): array of columns (strings or objects with `name`)
 *  - cellRender(column, row, cell), cellStyle(style, column, row, cell), cellClassName(className, column, row, cell)
 *  - headColRender(column, header), headRowRender(record)
 *  - columnFixedCount: number of leading columns kept visible while scrolling horizontally
 *  - onColumnWidth(width, column, header): resolves/receives column widths
 *  - onCellSelectionChange(selectedColumns, selectedRows, cell)
 */
const ForteTable = forwardRef(function ForteTable(props, ref) {
  const storeRef = useRef(null);
  if (!storeRef.current) storeRef.current = createTableStore();
  const store = storeRef.current;

  const containerRef = useRef(null);
  const apiRef = useRef(null);
  const propsRef = useRef(props);
  propsRef.current = props;

  // interaction state that must not trigger renders
  const dragging = useRef(false);
  const extent = useRef(null);

  const [widthOverrides, setWidthOverrides] = useState({});

  const columns = props.columns() || [];
  const rows = props.rows() || [];
  const rowsCount = props.rowsCount != null ? props.rowsCount : rows.length;
  const colsCount = props.colsCount || columns.length;
  const fixedCount = Math.min(props.columnFixedCount || 0, columns.length);

  const columnsWidth = columns.map((column, index) => {
    const override = widthOverrides[columnKey(column, index)];
    if (override != null) return override;

    const fromCallback = props.onColumnWidth
      ? props.onColumnWidth(undefined, column)
      : undefined;
    const fromColumn =
      column && typeof column === 'object'
        ? column.userColumnWidth || column.defaultColumnWidth
        : undefined;

    return (
      fromCallback ||
      fromColumn ||
      props.defaultColumnWidth ||
      DEFAULT_COLUMN_WIDTH
    );
  });

  const { vars } = columnVars(columnsWidth, fixedCount);

  // latest values read by stable callbacks
  const ctx = useRef();
  ctx.current = {
    columns,
    rows,
    rowsCount,
    colsCount,
    fixedCount,
    columnsWidth,
  };

  const controllerRef = useRef(null);
  const getTableController = useCallback(() => {
    const p = propsRef.current;
    if (!controllerRef.current && p.createController)
      controllerRef.current = p.createController(apiRef.current);
    return (
      controllerRef.current || (p.getTableController && p.getTableController())
    );
  }, []);

  /* ---------------------------- selection ---------------------------- */

  const getSelectedColumns = useCallback(() => {
    const { selection } = store.getState();
    if (!selection) return [];
    return ctx.current.columns.slice(selection.c0, selection.c1 + 1);
  }, [store]);

  const getSelectedRows = useCallback(() => {
    const { selection } = store.getState();
    if (!selection) return [];
    return ctx.current.rows.slice(selection.r0, selection.r1 + 1);
  }, [store]);

  const setSelection = useCallback(
    rect => {
      // a single cell is not considered a selection
      const next =
        rect && (rect.c0 !== rect.c1 || rect.r0 !== rect.r1) ? rect : null;
      if (!sameRect(store.getState().selection, next)) {
        store.setState({ selection: next });
      }
    },
    [store]
  );

  const notifySelection = useCallback(
    cell => {
      const p = propsRef.current;
      if (p.onCellSelectionChange) {
        p.onCellSelectionChange(getSelectedColumns(), getSelectedRows(), cell);
      }
    },
    [getSelectedColumns, getSelectedRows]
  );

  /* ------------------------------ active ------------------------------ */

  const buildHandle = useCallback(
    (rowIndex, columnIndex) =>
      makeCellHandle({
        record: ctx.current.rows[rowIndex],
        column: ctx.current.columns[columnIndex],
        rowIndex,
        columnIndex,
        activeRow: true,
        isActive: true,
        isSelected: false,
      }),
    []
  );

  const setActiveCell = useCallback(
    (rowIndex, columnIndex, cellHandle) => {
      const {
        colsCount: cc,
        rowsCount: rc,
        rows: rs,
        columns: cs,
      } = ctx.current;
      if (
        columnIndex < 0 ||
        columnIndex >= cc ||
        rowIndex < 0 ||
        rowIndex >= rc
      )
        return;

      const prev = store.getState();
      if (prev.activeRow === rowIndex && prev.activeCol === columnIndex) return;

      store.setState({ activeRow: rowIndex, activeCol: columnIndex });

      const p = propsRef.current;
      if (prev.activeRow !== rowIndex && p.setActiveRow)
        p.setActiveRow(rs[rowIndex], rowIndex);
      if (prev.activeCol !== columnIndex && p.setActiveColumn)
        p.setActiveColumn(cs[columnIndex], columnIndex);
      if (p.setActiveCell)
        p.setActiveCell(
          cellHandle || buildHandle(rowIndex, columnIndex),
          columnIndex,
          rowIndex
        );
    },
    [store, buildHandle]
  );

  const scrollToCell = useCallback((rowIndex, columnIndex) => {
    const el =
      containerRef.current &&
      containerRef.current.querySelector(
        `[data-ft-row="${rowIndex}"] [data-ft-col="${columnIndex}"]`
      );
    if (el && el.scrollIntoView)
      el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, []);

  /* --------------------------- mouse dragging --------------------------- */

  // anchor is the fixed corner of the selection, focus the moving one
  const applyExtent = useCallback(
    (anchor, focus) => {
      extent.current = { anchor, focus };
      setSelection(toRect(anchor, focus));
    },
    [setSelection]
  );

  // with `extend` (shift+click) the selection grows from the current active cell
  const onSelectionDragStart = useCallback(
    (rowIndex, columnIndex, extend) => {
      const { activeRow, activeCol } = store.getState();
      const target = { row: rowIndex, col: columnIndex };
      dragging.current = true;

      if (extend && activeRow >= 0) {
        applyExtent({ row: activeRow, col: activeCol }, target);
      } else {
        extent.current = { anchor: target, focus: target };
        setSelection(null);
      }
    },
    [store, applyExtent, setSelection]
  );

  const onSelectionDragMove = useCallback(
    (rowIndex, columnIndex) => {
      if (!dragging.current || !extent.current) return;
      const { anchor } = extent.current;
      applyExtent(anchor, {
        row: rowIndex,
        col: anchor.fullRow ? ctx.current.colsCount - 1 : columnIndex,
      });
    },
    [applyExtent]
  );

  const onSelectionDragEnd = useCallback(
    cell => {
      if (!dragging.current) return;
      dragging.current = false;
      notifySelection(cell);
    },
    [notifySelection]
  );

  // clicking/dragging on row headings selects whole records
  const onRowHeadingMouseDown = useCallback(
    (rowIndex, event) => {
      if (event.button !== 0) return;
      const { activeRow } = store.getState();
      const anchorRow = event.shiftKey && activeRow >= 0 ? activeRow : rowIndex;

      if (anchorRow === rowIndex) setActiveCell(rowIndex, 0);
      dragging.current = true;
      applyExtent(
        { row: anchorRow, col: 0, fullRow: true },
        { row: rowIndex, col: ctx.current.colsCount - 1 }
      );
    },
    [store, setActiveCell, applyExtent]
  );

  // ends a drag released outside the cells
  useEffect(() => {
    const onUp = () => onSelectionDragEnd();
    document.addEventListener('mouseup', onUp);
    return () => document.removeEventListener('mouseup', onUp);
  }, [onSelectionDragEnd]);

  /* ----------------------------- keyboard ----------------------------- */

  const clamp = (rowIndex, columnIndex) => ({
    row: Math.max(0, Math.min(ctx.current.rowsCount - 1, rowIndex)),
    col: Math.max(0, Math.min(ctx.current.colsCount - 1, columnIndex)),
  });

  const moveActive = useCallback(
    (rowIndex, columnIndex) => {
      const { row, col } = clamp(rowIndex, columnIndex);
      extent.current = null;
      setActiveCell(row, col);
      scrollToCell(row, col);

      if (store.getState().selection) {
        setSelection(null);
        notifySelection(buildHandle(row, col));
      }
    },
    [
      store,
      setActiveCell,
      scrollToCell,
      setSelection,
      notifySelection,
      buildHandle,
    ]
  );

  // keeps the active cell and moves the focus corner of the selection
  const extendTo = useCallback(
    (rowIndex, columnIndex) => {
      const focus = clamp(rowIndex, columnIndex);
      const { activeRow, activeCol } = store.getState();
      const anchor = extent.current
        ? extent.current.anchor
        : { row: activeRow, col: activeCol };

      applyExtent(anchor, focus);
      scrollToCell(focus.row, focus.col);
      notifySelection(buildHandle(focus.row, focus.col));
    },
    [store, applyExtent, scrollToCell, notifySelection, buildHandle]
  );

  const setActiveNext = useCallback(
    (direction = 1) => {
      const { activeRow, activeCol } = store.getState();
      const { rowsCount: rc, colsCount: cc } = ctx.current;
      if (activeRow < 0) return moveActive(0, 0);

      let c = activeCol + direction;
      let r = activeRow;
      if (c >= cc) {
        c = 0;
        r = r + 1 >= rc ? 0 : r + 1;
      }
      if (c < 0) {
        c = cc - 1;
        r = r - 1 < 0 ? rc - 1 : r - 1;
      }
      moveActive(r, c);
    },
    [store, moveActive]
  );

  const onKeyDown = evt => {
    if (props.onKeyDown) props.onKeyDown(evt, apiRef.current);
    if (evt.defaultPrevented) return;

    if (evt.key === 'Tab') {
      setActiveNext(evt.shiftKey ? -1 : 1);
      evt.preventDefault();
      return;
    }

    const { activeRow, activeCol } = store.getState();
    if (isEditable(evt.target) || activeRow < 0) return;

    const { rowsCount: rc, colsCount: cc } = ctx.current;
    const toEnd = evt.ctrlKey || evt.metaKey;
    const base =
      evt.shiftKey && extent.current
        ? extent.current.focus
        : { row: activeRow, col: activeCol };
    let target;

    switch (evt.key) {
      case 'ArrowUp':
        target = [toEnd ? 0 : base.row - 1, base.col];
        break;
      case 'ArrowDown':
        target = [toEnd ? rc - 1 : base.row + 1, base.col];
        break;
      case 'ArrowLeft':
        target = [base.row, toEnd ? 0 : base.col - 1];
        break;
      case 'ArrowRight':
        target = [base.row, toEnd ? cc - 1 : base.col + 1];
        break;
      default:
        return;
    }

    evt.preventDefault();
    if (evt.shiftKey) extendTo(target[0], target[1]);
    else moveActive(target[0], target[1]);
  };

  /* --------------------------- column resizing --------------------------- */

  // while dragging only CSS variables are updated: the body is not re-rendered
  const previewColumnWidth = useCallback((index, width) => {
    const el = containerRef.current;
    if (!el) return;
    const widths = ctx.current.columnsWidth.slice();
    widths[index] = Math.max(MIN_COLUMN_WIDTH, width);
    const { vars: next } = columnVars(widths, ctx.current.fixedCount);
    Object.keys(next).forEach(name => el.style.setProperty(name, next[name]));
  }, []);

  const commitColumnWidth = useCallback((index, width, header) => {
    const column = ctx.current.columns[index];
    let finalWidth = Math.max(MIN_COLUMN_WIDTH, width);
    const p = propsRef.current;
    if (p.onColumnWidth)
      finalWidth = p.onColumnWidth(finalWidth, column, header) || finalWidth;

    setWidthOverrides(prev => ({
      ...prev,
      [columnKey(column, index)]: finalWidth,
    }));
    return finalWidth;
  }, []);

  /* ---------------------------- imperative API ---------------------------- */

  apiRef.current = {
    getSelectedColumns,
    getSelectedRows,
    getActiveCoords: () => {
      const { activeRow, activeCol } = store.getState();
      return { row: activeRow, col: activeCol };
    },
    setActiveCoords: (columnIndex, rowIndex) =>
      moveActive(rowIndex, columnIndex),
    setActiveNext,
    selectRange: (startCol, startRow, endCol, endRow) => {
      applyExtent(
        { col: startCol, row: startRow },
        { col: endCol, row: endRow }
      );
      notifySelection();
    },
    clearSelection: () => {
      extent.current = null;
      setSelection(null);
      notifySelection();
    },
    scrollToCell,
    get element() {
      return containerRef.current;
    },
    get scrollTop() {
      return containerRef.current ? containerRef.current.scrollTop : 0;
    },
    set scrollTop(value) {
      if (containerRef.current) containerRef.current.scrollTop = value;
    },
    get scrollHeight() {
      return containerRef.current ? containerRef.current.scrollHeight : 0;
    },
  };

  useImperativeHandle(ref, () => apiRef.current);

  // stable across renders: memoized rows only re-render when their own inputs change
  const table = useMemo(
    () => ({
      store,
      getProps: () => propsRef.current,
      getTableController,
      setActiveCell,
      onSelectionDragStart,
      onSelectionDragMove,
      onSelectionDragEnd,
      onRowHeadingMouseDown,
      previewColumnWidth,
      commitColumnWidth,
    }),
    [
      store,
      getTableController,
      setActiveCell,
      onSelectionDragStart,
      onSelectionDragMove,
      onSelectionDragEnd,
      onRowHeadingMouseDown,
      previewColumnWidth,
      commitColumnWidth,
    ]
  );

  return (
    <div
      ref={containerRef}
      className={`forteTableContainer ft-table${
        props.className ? ` ${props.className}` : ''
      }`}
      style={{ ...vars, ...props.style }}
      tabIndex={0}
      onKeyDown={onKeyDown}
      role='grid'
      aria-rowcount={rowsCount}
      aria-colcount={colsCount}
    >
      <div className='ft-table__inner'>
        <TableHeader
          table={table}
          columns={columns}
          columnsWidth={columnsWidth}
          fixedCount={fixedCount}
          headColRender={props.headColRender}
          onColumnHeaderClick={props.onColumnHeaderClick}
        />
        <TableBody
          table={table}
          rows={rows}
          columns={columns}
          fixedCount={fixedCount}
          cellRender={props.cellRender}
          cellStyle={props.cellStyle}
          cellClassName={props.cellClassName}
          headRowRender={props.headRowRender}
          type={props.type || 'small'}
          model={props.model}
        />
      </div>
    </div>
  );
});

export default ForteTable;
