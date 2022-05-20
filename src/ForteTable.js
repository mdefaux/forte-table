import React from 'react';
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

    if (props.createController)
      // if there is a controller factory, call it
      this.state.tableController = props.createController(this);
  }

  /** Sets the width for each column.
   *
   */
  componentWillMount() {
    const columnsWidth = this.props.columns().map((column, index) => {
      let columnWidth;

      if (this.props.onColumnWidth)
        columnWidth = this.props.onColumnWidth(columnWidth, column);

      columnWidth = columnWidth || this.props.defaultColumnWidth || 150;

      return columnWidth;
    });
    this.setState({ columnsWidth: columnsWidth }); // puts in state the array with columns width
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
    let columnsWidth = this.state.columnsWidth; // gets the array of the columns width
    columnsWidth[index] = columnWidth; // updates the value in the corresponding position
    this.setState({ columnsWidth: columnsWidth }); // saves the array of columns width into state (and refresh the whole table)

    return columnWidth;
  };

  /** Checks if new row is to be rendered
   *
   */
  componentDidUpdate() {}

  /**Sets a row as active. Memorizes the row index and eventually the row id.
   *
   * @param row - the row object corresponding to active row
   * @param rowIndex - index of the active row
   */
  setActiveRow = (row, rowIndex) => {
    this.setState({
      activeRow: row,
      activeRowIndex: rowIndex,
    });

    if (this.props.setActiveRow) return this.props.setActiveRow(row, rowIndex);
  };

  /**Sets a column as active. Memorizes the row index and eventually the row id.
   *
   * @param column
   * @param columnIndex
   */
  setActiveColumn = (column, columnIndex) => {
    this.setState({
      activeColumn: column,
      activeColumnIndex: columnIndex,
    });

    if (this.props.setActiveColumn)
      return this.props.setActiveColumn(column, columnIndex);
  };

  /**Sets the active cell. Memorizes the row and column index of the cell.
   *
   * @param cell - cell to be activated.
   */
  setActiveCell = cell => {
    if (!cell) {
      debugger;
    }

    if (cell === this.state.activeCell) return;

    this.setState({
      activeCell: cell,
      activeRowIndex: cell.props.rowIndex,
      activeColIndex: cell.props.columnIndex,
    });
    this.setActiveRow(cell.props.row, cell.props.rowIndex);
    this.setActiveColumn(cell.props.column, cell.props.columnIndex);

    if (this.props.setActiveCell)
      return this.props.setActiveCell(
        cell,
        cell.props.columnIndex,
        cell.props.rowIndex
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


  goLeft( toEnd, selection )
  {
    if( this.props.columnIndex === 0 )
      return;
      
    if( selection && !this.dragStartCells ) {
      this.startSelectionAt( this.state.activeColIndex, this.state.activeRowIndex );
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

  onSelectionDragStart = cell => {
    this.dragStartCells = {
      col: cell.props.columnIndex,
      row: cell.props.rowIndex,
    };
    let selectedRows = {};
    selectedRows[cell.props.rowIndex] = {}; // [this.dragStartCells];

    this.setState({
      mouseDragging: true,
      selectedCells: selectedRows,
      selectedStartCoord: false,
      selectedEndCoord: false,
    });
    return false;
  };

  onSelectionDragMove = cell => {
    if (!this.dragStartCells || !this.state.mouseDragging)
      // if there is no drag started, exits
      return;

    this.onSelectionDragMoveAt(cell.props.columnIndex, cell.props.rowIndex);
  };

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
      this.setState({
        selectedCells: [],
        selectedStartCoord: false,
        selectedEndCoord: false,
      });
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
      this.state.selectedStartCoord &&
      this.state.selectedStartCoord.col === startCoord.col &&
      this.state.selectedStartCoord.row === startCoord.row &&
      this.state.selectedEndCoord &&
      this.state.selectedEndCoord.col === endCoord.col &&
      this.state.selectedEndCoord.row === endCoord.row
    ) {
      return false;
    }

    // stores the selection coordinates in state and refresh the rendering of whole table
    this.setState({
      selectedCells: selectedRows,
      selectedStartCoord: startCoord,
      selectedEndCoord: endCoord,
    });
    return false;
  };

  onSelectionDragEnd = cell => {

    this.setState( {mouseDragging: false}, () => {

      if (this.props.onCellSelectionChange) {
        this.props.onCellSelectionChange(
          this.getSelectedColumns(),
          this.getSelectedRows()
        );
      }
    } );
  };

  getSelectedColumns = () => {
    if (!this.state.selectedStartCoord) return [];

    let columns = this.props.columns();

    // returns a subset copy of the array from start selection to end selection
    return columns.slice(
      this.state.selectedStartCoord.col,
      this.state.selectedEndCoord.col + 1
    );
  };

  getSelectedRows = () => {
    if (!this.state.selectedStartCoord) return [];

    let rows = this.props.rows();

    // returns a subset copy of the array from start selection to end selection
    return rows.slice(
      this.state.selectedStartCoord.row,
      this.state.selectedEndCoord.row + 1
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

  /**Renders ForteDataGrid component.
   * Composes a Toolbar, a table header and a table body.
   *
   * @returns {XML}
   */
  render() {
    const width = this.props.tableWidth;
    const height = this.props.tableheight;

    const tableHeader = (
      <TableHeader
        columns={this.props.columns}
        headColRender={this.props.headColRender}
        onColumnHeaderClick={this.props.onColumnHeaderClick || (index => {})}
        // changeSortColumn={this.changeSortColumn}
        sorting={this.state.sorting}
        loggedUser={this.props.loggedUser}
        onColumnWidth={this.onColumnWidth}
        columnsWidth={this.state.columnsWidth}
      />
    );
    const tableBody = (
      <TableBody
        rows={this.props.rows}
        rowsCount={this.getRowsCount()}
        columns={this.props.columns}
        cellRender={this.props.cellRender}
        cellStyle={this.props.cellStyle}
        cellClassName={this.props.cellClassName}
        columnsWidth={this.state.columnsWidth}
        headRowRender={this.props.headRowRender}
        tableController={this.state.tableController}
        getTableController={this.props.getTableController}
        type={this.props.type ? this.props.type : 'small'}
        // setActiveRow={this.setActiveRow}
        setActiveCell={this.setActiveCell}
        activeRowIndex={this.state.activeRowIndex}
        activeColIndex={this.state.activeColIndex}
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
      />
    );
    const tableFooter = '';

    return (
      <div
        style={this.props.style}
        className="forteTableContainer"
        onKeyDown={this.onKeyDown}
        ref={b => {
          this.tableBody = b;
        }}
      >
        {tableHeader}
        {tableBody}
      </div>
    );
  }
}

export default ForteTable;
