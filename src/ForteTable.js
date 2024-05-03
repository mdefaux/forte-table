import React, { Component } from 'react';
import TableHeader from './TableHeader';
import TableBody from './TableBody';

/** ForteDataGrid displays a table given a set of columns and a set of rows.
 *  Cells will receive the column and the row data to draw itself:
 *  redefine CellModel in order to customize the aspect of the content.
 *
 */
class ForteTable extends React.Component {
  constructor(props) {
    super(props);

    // this.state = {};

    this.dragStartCells = false; // keeps the starting cell of a drag, if false no drag is currently active
    this.activeCell = false;
    this.activeRow = false;

    if (props.createController)
      // if there is a controller factory, call it
      this.state.tableController = props.createController(this);
  }

  state = {}

  /** Sets the width for each column.
   *
   */
  componentDidMount() {
    // const columnsWidth = this.props.columns().map((column, index) => {
    //   let columnWidth;

    //   if (this.props.onColumnWidth)
    //     columnWidth = this.props.onColumnWidth(columnWidth, column);

    //   columnWidth = columnWidth || this.props.defaultColumnWidth || 150;

    //   return columnWidth;
    // });
    // this.setState({ columnsWidth: columnsWidth }); // puts in state the array with columns width
  }

  getColumnsWidth() {
    return this.props.columns().map((column, index) => {
      let columnWidth;

      if (this.props.onColumnWidth)
        columnWidth = this.props.onColumnWidth(columnWidth, column);

      columnWidth = columnWidth || this.props.defaultColumnWidth || 150;

      return columnWidth;
    });
  }

  /**Callback invoked by ColumnHeader when resized.
   *
   * @param columnWidth - the new value of the column width after resizing
   * @param index - index of the column into model.
   * @param headerComponent - the headerColumn component that has been sized.
   * @return {*} the new value of the column width, eventually modified by a custom callback.
   */
  onColumnWidth = (columnWidth, index, headerComponent) => {
    let column = this.props.columns()[index];

    if (this.props.onColumnWidth)
      columnWidth = this.props.onColumnWidth(
        columnWidth,
        column,
        headerComponent
      );

    // updates the state... and redraws the table
    // let columnsWidth = this.state.columnsWidth; // gets the array of the columns width
    // columnsWidth[index] = columnWidth; // updates the value in the corresponding position
    // this.setState({ columnsWidth: columnsWidth }); // saves the array of columns width into state (and refresh the whole table)

    this.forceUpdate();

    return columnWidth;
  };

  /** Checks if new row is to be rendered
   *
   */
  componentDidUpdate() {}

  /**Saves an array of all row components as soon as they are rendered
   * 
   * @param {*} rows 
   */
  onRowsRendered( rows ) {
    this.rowsRendered = rows;
  }

  /**Sets a row as active. Memorizes the row index and eventually the row id.
   *
   * @param row - the row object corresponding to active row
   * @param rowIndex - index of the active row
   */
  setActiveRow = (row, rowIndex, colIndex, rowComponent) => {
    // if same row active, does nothing
    if (this.activeRow === rowComponent ) {
      this.activeRow.setActive(true, colIndex);
      return;
    }

    // re-render previous active row
    if (this.activeRow) {
      this.activeRow.setActive(false);
    }

    // sets the new refs to active row
    this.activeRowIndex = rowIndex;
    this.activeRow = rowComponent;
    this.activeRow.setActive(true, colIndex);

    // this.setState({
    //   activeRow: row,
    //   activeRowIndex: rowIndex,
    // });

    // calls callback
    if (this.props.setActiveRow) {
      return this.props.setActiveRow(row, rowIndex);
    }
  };

  /**Sets a column as active. Memorizes the row index and eventually the row id.
   *
   * @param column
   * @param columnIndex
   */
  setActiveColumn = (column, columnIndex) => {
    // this.setState({
    //   activeColumn: column,
    //   activeColumnIndex: columnIndex,
    // });
    
    this.activeColumn = column;
    this.activeColIndex = columnIndex;

    if (this.props.setActiveColumn)
      return this.props.setActiveColumn(column, columnIndex);
  };

  /**Sets the active cell. Memorizes the row and column index of the cell.
   *
   * @param cellComponent - cell to be activated.
   */
  setActiveCell = (cellComponent, rowComponent) => {
    // assert (cellComponent);

    // if (cellComponent === this.state.activeCell) return;
    if (cellComponent === this.activeCell){ 
      return;
    }

    // this.setState({
    //   activeCell: cellComponent,
    //   activeRowIndex: cellComponent.props.rowIndex,
    //   activeColIndex: cellComponent.props.columnIndex,
    // });
    this.activeCell = cellComponent;
    // this.activeColIndex = cellComponent.props.columnIndex;

    this.setActiveRow(
      cellComponent.props.row, 
      cellComponent.props.rowIndex, cellComponent.props.columnIndex, 
      rowComponent );
    this.setActiveColumn(cellComponent.props.column, cellComponent.props.columnIndex);

    if (this.props.setActiveCell)
      return this.props.setActiveCell(
        cellComponent,
        cellComponent.props.columnIndex,
        cellComponent.props.rowIndex
      );
  };

  notifyActiveCell = cell => {
    if (!cell) {
      debugger;
    }

    if (cell === this.state.activeCell) {
      return;
    }

    this.setState({
      activeCell: cell,
      activeRowIndex: cell.props.rowIndex,
      activeColIndex: cell.props.columnIndex,
    });

    if (this.props.setActiveCell)
      return this.props.setActiveCell(
        cell,
        cell.props.columnIndex,
        cell.props.rowIndex
      );
  };

  getRowsCount() {
    return this.props.rowsCount;
  }

  getColsCount() {
    return this.props.colsCount || this.props.columns().length;
  }

  /**Sets the active cell. Memorizes the row and column index of the cell.
   *
   * @param cell - cell to be activated.
   */
  setActiveNext = direction => {
    direction = direction || 1;

    let colsCount = this.getColsCount();
    let rowsCount = this.getRowsCount();
    let newColIndex = this.state.activeColIndex + direction;
    let newRowIndex = this.state.activeRowIndex;

    if (newColIndex >= colsCount) {
      newColIndex = 0;
      newRowIndex++;

      if (newRowIndex >= rowsCount) {
        newRowIndex = 0;
      }
    }
    if (newColIndex < 0) {
      newColIndex = colsCount - 1;
      newRowIndex--;

      if (newRowIndex < 0) {
        newRowIndex = rowsCount - 1;
      }
    }
    this.setActiveCoords( newColIndex, newRowIndex );
  }

  startSelectionAt( colIndex, rowIndex ) {
    
    this.dragStartCells = {
      col: colIndex,
      row: rowIndex,
    };  
  }


  moveCursor( toEnd, selection )
  {
    if( this.props.columnIndex === 0 )
      return;
      
    if( selection && !this.dragStartCells ) {
      this.startSelectionAt( this.state.activeColIndex, this.state.activeRowIndex );
    }
    if( !selection ) {
      this.dragStartCells = false;
    }

    let newCoord = toEnd ? 0 : this.state.activeColIndex - 1;
    this.setActiveCoords( newCoord, this.state.activeRowIndex );

    if( selection ) {
      this.onSelectionDragMoveAt( newCoord, this.state.activeRowIndex );
      this.onSelectionDragEnd();
    }
  }


  goLeft( toEnd, selection )
  {
    if( this.props.columnIndex === 0 )
      return;
      
    if( selection && !this.dragStartCells ) {
      this.startSelectionAt( this.state.activeColIndex, this.state.activeRowIndex );
    }
    if( !selection ) {
      this.dragStartCells = false;
    }

    let newCoord = toEnd ? 0 : this.state.activeColIndex - 1;
    this.setActiveCoords( newCoord, this.state.activeRowIndex );

    if( selection ) {
      this.onSelectionDragMoveAt( newCoord, this.state.activeRowIndex );
      this.onSelectionDragEnd();
    }
  }

  goRight( toEnd, selection )
  {
    if( selection && !this.dragStartCells ) {
      this.startSelectionAt( this.state.activeColIndex, this.state.activeRowIndex );
    }
    if( !selection ) {
      this.dragStartCells = false;
    }

    let newCoord = toEnd ? this.getColsCount() -1 : this.state.activeColIndex + 1;
    this.setActiveCoords( newCoord, this.state.activeRowIndex );

    if( selection ) {
      this.onSelectionDragMoveAt( newCoord, this.state.activeRowIndex );
      this.onSelectionDragEnd();
    }
  }

  goUp( toEnd, selection )
  {
    if( selection && !this.dragStartCells ) {
      this.startSelectionAt( this.state.activeColIndex, this.state.activeRowIndex );
    }
    if( !selection ) {
      this.dragStartCells = false;
    }

    let newCoord = toEnd ? 0 : this.state.activeRowIndex - 1;
    this.setActiveCoords( this.state.activeColIndex, newCoord );

    if( selection ) {
      this.onSelectionDragMoveAt( this.state.activeColIndex, newCoord );
      this.onSelectionDragEnd();
    }
  }

  goDown( toEnd, selection )
  {
    if( selection && !this.dragStartCells ) {
      this.startSelectionAt( this.state.activeColIndex, this.state.activeRowIndex );
    }
    if( !selection ) {
      this.dragStartCells = false;
    }

    let newCoord = toEnd ? this.getRowsCount() -1 : this.state.activeRowIndex + 1;
    this.setActiveCoords( this.state.activeColIndex, newCoord );

    if( selection ) {
      this.onSelectionDragMoveAt( this.state.activeColIndex, newCoord );
      this.onSelectionDragEnd();
    }
  }

  /**Sets the active cell. Memorizes the row and column index of the cell.
   *
   * @param cell - cell to be activated.
   */
  setActiveCoords( newColIndex, newRowIndex ) {
    // if out of range, does nothing
    if (newColIndex >= this.getColsCount() || newColIndex < 0 
      || newRowIndex >= this.getRowsCount() || newRowIndex < 0 ) 
    {
      return;
    }

    this.setState({
      // activeCell: cell,
      activeRowIndex: newRowIndex,
      activeColIndex: newColIndex,
    });
  };

  /**Handler called when a mouse down event generated on a cell
   * setups and starts a dragging of selection
   * 
   * @param {Component} cell 
   * @returns false
   */
  onSelectionDragStart = cell => {
    this.dragStartCells = {
      col: cell.props.columnIndex,
      row: cell.props.rowIndex,
    };
    let selectedRows = {};
    selectedRows[cell.props.rowIndex] = {}; // [this.dragStartCells];

    if (this.selectedStartCoord && this.selectedEndCoord) {
      this.refreshRowSelection(
        this.selectedStartCoord.row,
        this.selectedEndCoord.row,
        false);
    }

    // was this.setState({
    this.mouseDragging= true;
    this.selectedCells= selectedRows;
    this.selectedStartCoord= false;
    this.selectedEndCoord= false;
      
    return false;
  };

  /**Handler called when mouse moves over a cell.
   * If a drag mode is active, updates the selected zone.
   * 
   * @param {Component} cell 
   * @returns 
   */
  onSelectionDragMove = cell => {
    if (!this.dragStartCells || !this.mouseDragging)
      // if there is no drag active, does nothing
      return;

    this.onSelectionDragMoveAt(cell.props.columnIndex, cell.props.rowIndex);
  };

  /**Updates the selection zone to given coords
   * 
   * @param {*} columnIndex 
   * @param {*} rowIndex 
   * @param {*} optStartCol 
   * @param {*} optStartRow 
   * @returns 
   */
  onSelectionDragMoveAt(columnIndex, rowIndex, optStartCol, optStartRow ) {
    let selectedRows = {}; // empties the selected value

    // defines start and end coordinates: end coords should be > than start.
    // takes the min coordinates from starting cell and pointed cell
    let startCoord = {
      col: Math.min( optStartCol || this.dragStartCells.col, columnIndex),
      row: Math.min( optStartRow || this.dragStartCells.row, rowIndex),
    };
    // takes the max coordinates from starting cell and pointed cell
    let endCoord = {
      col: Math.max( optStartCol || this.dragStartCells.col, columnIndex),
      row: Math.max( optStartRow ||this.dragStartCells.row, rowIndex),
    };

    // Avoids the selection of the single cell when user click and move on the same cell
    // if drag selection ends where started, clears entire selection (?)
    if (startCoord.col === endCoord.col && startCoord.row === endCoord.row) {
      
      this.refreshRowSelection( 
        this.selectedStartCoord.row, 
        this.selectedEndCoord.row, 
        false );
        
      // was this.setState({
      this.selectedCells= {};
      this.selectedStartCoord= startCoord;
      this.selectedEndCoord= endCoord;
      
      return true;
    }

    // fills the array of selected rows with an array of selected cells
    for (let r = startCoord.row; r <= endCoord.row; r++) {
      selectedRows[r] = {};
      for (let c = startCoord.col; c <= endCoord.col; c++) {
        selectedRows[r][c] = { col: c, row: r };
      }
    }

    // checks if nothing has varied
    if (
      this.selectedStartCoord &&
      this.selectedStartCoord.col === startCoord.col &&
      this.selectedStartCoord.row === startCoord.row &&
      this.selectedEndCoord &&
      this.selectedEndCoord.col === endCoord.col &&
      this.selectedEndCoord.row === endCoord.row
    ) {
      return false;
    }

    // updates only the selected rows
    const startUpdate = Math.min( this.selectedStartCoord.row, startCoord.row );
    const endUpdate = Math.max( this.selectedEndCoord.row, endCoord.row );
    this.refreshRowSelection( startUpdate, endUpdate, selectedRows );

    // stores the selection coordinates in state and refresh the rendering of whole table
    // was this.setState({
    this.selectedCells= selectedRows;
    this.selectedStartCoord= startCoord;
    this.selectedEndCoord= endCoord;
    // });

    return false;
  };

  refreshRowSelection( startUpdate, endUpdate, selectedRows ) {

    for( let r= startUpdate; r <= endUpdate; r++ ) {
      this.rowsRendered[r].selectCells( selectedRows[r] );
    }
  }

  /**Handler called when mouse up. Stops dragging selection mode.
   * 
   * @param {*} cell 
   */
  onSelectionDragEnd = cell => {

    // this.setState( {mouseDragging: false}, () => {

    this.mouseDragging = false;

    if (this.props.onCellSelectionChange) {
      this.props.onCellSelectionChange(
        this.getSelectedColumns(),
        this.getSelectedRows(),
        cell
      );
    }
    // } );
  };

  getSelectedColumns = () => {
    if (!this.selectedStartCoord) return [];

    let columns = this.props.columns();

    // returns a subset copy of the array from start selection to end selection
    return columns.slice(
      this.selectedStartCoord.col,
      this.selectedEndCoord.col + 1
    );
  };

  getSelectedRows = () => {
    if (!this.selectedStartCoord) return [];

    let rows = this.props.rows();

    // returns a subset copy of the array from start selection to end selection
    return rows.slice(
      this.selectedStartCoord.row,
      this.selectedEndCoord.row + 1
    );
  };

  onKeyDown = evt => {
    // debugger;
    evt = evt || window.event;
    if (this.props.onKeyDown) this.props.onKeyDown(evt, this);
    if (evt.keyCode === 9) {
      // debugger;
      if (evt.shiftKey) this.setActiveNext(-1);
      else this.setActiveNext(1);
      evt.preventDefault();
    }
    if (evt.key === 'ArrowUp') {
      // up arrow
      this.goUp( evt.ctrlKey, evt.shiftKey );
    }
    if (evt.key === 'ArrowRight') {
      // right arrow
      this.goRight( evt.ctrlKey, evt.shiftKey );
    }
    if (evt.key === 'ArrowDown') {
      // down arrow
      this.goDown( evt.ctrlKey, evt.shiftKey );
    }
    if (evt.key === 'ArrowLeft') {
      // left arrow
      this.goLeft( evt.ctrlKey, evt.shiftKey );
    }
  };

  renderBody( style = {}, columnRangeStart, columnRangeEnd, columnInactiveCount ) {
    const columnsWidth = this.getColumnsWidth();
    return (
      <TableBody
        rows={this.props.rows}
        rowsCount={this.getRowsCount()}
        columns={this.props.columns}
        columnRangeStart={columnRangeStart}
        columnRangeEnd={columnRangeEnd}
        columnInactiveCount={columnInactiveCount}
        style={ style }
        cellRender={this.props.cellRender}
        cellStyle={this.props.cellStyle}
        cellClassName={this.props.cellClassName}
        columnsWidth={columnsWidth}
        headRowRender={this.props.headRowRender}
        tableController={this.state.tableController}
        getTableController={this.props.getTableController}
        type={this.props.type ? this.props.type : 'small'}
        // setActiveRow={this.setActiveRow}
        setActiveCell={this.setActiveCell}
        activeRowIndex={this.activeRowIndex}
        activeColIndex={this.activeColIndex}
        onCellClick={this.props.onCellClick}
        onCellDoubleClick={this.props.onCellDoubleClick}
        onCellMouseDown={this.props.onCellMouseDown}
        onCellMouseMove={this.props.onCellMouseMove}
        onCellMouseUp={this.props.onCellMouseUp}
        onCellKeyDown={this.props.onCellKeyDown}
        onCellKeyUp={this.props.onCellKeyUp}
        selectedCells={this.state.selectedCells}
        onSelectionDragStart={this.onSelectionDragStart}
        onSelectionDragMove={this.onSelectionDragMove}
        onSelectionDragEnd={this.onSelectionDragEnd}
        newRow={this.props.newRow}
        notifyActiveCell={this.notifyActiveCell}
        readOnly={this.props.readOnly}
        onRowsRendered={(rows)=>this.onRowsRendered(rows)}
      />
    );
  }

  renderHeader( style, columnRangeStart, columnRangeEnd, columnInactiveCount) {
    return <TableHeader
      columns={this.props.columns}
      columnRangeStart={columnRangeStart}
      columnRangeEnd={columnRangeEnd}
      columnInactiveCount={columnInactiveCount}
      style={ style }
      headColRender={this.props.headColRender}
      onColumnHeaderClick={this.props.onColumnHeaderClick || (index => { })}
      // changeSortColumn={this.changeSortColumn}
      sorting={this.state.sorting}
      loggedUser={this.props.loggedUser}
      onColumnWidth={this.onColumnWidth}
      columnsWidth={this.getColumnsWidth()} />;
  }

  /**Renders ForteDataGrid component.
   * Composes a Toolbar, a table header and a table body.
   *
   * @returns {XML}
   */
  render() {
    const width = this.props.tableWidth;
    const height = this.props.tableheight;
    const columnRangeStart = this.props.columnFixedCount ? 0 : undefined;
    const columnRangeEnd = this.props.columnFixedCount;

    const tableFixedHeader = columnRangeEnd && 
      this.renderHeader( { left: '0px', top: '-42px', position: 'absolute' }, 
      columnRangeStart, columnRangeEnd);

    const tableHeader = this.renderHeader( {}, undefined, columnRangeEnd, undefined );

    // const tableBody = this.renderBody( columnRangeEnd && { position: 'absolute' } );
    const tableBody = this.renderBody( {backgroundColor: 'white'}, columnRangeStart, columnRangeEnd );

    // const tableBodyFixed = columnRangeEnd && this.renderBody( {
    //   position: 'sticky', left: '0px', backgroundColor: 'white'},
    //   columnRangeStart, columnRangeEnd );
    const tableFooter = '';

    return (
      <div
        style={{
          // borderCollapse: 'collapse',
          ...this.props.style, position: 'relative'
        }}
        className="forteTableContainer"
        onKeyDown={this.onKeyDown}
        ref={b => {
          this.tableBody = b;
        }}
      >
        {tableHeader}
        {/* <div style={{
          position: "sticky", top: '0px', left: '0px', zIndex: 20
        }}>
          {tableFixedHeader}
        </div> */}
        {tableBody}
        {/* {tableBodyFixed} */}
      </div>
    );
  }
}

export default ForteTable;
