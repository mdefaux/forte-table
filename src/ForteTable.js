import React from 'react'
import TableHeader from './TableHeader'
import TableBody from './TableBody'

/** ForteDataGrid displays a table given a set of columns and a set of rows.
 *  Cells will receive the column and the row data to draw itself:
 *  redefine CellModel in order to customize the aspect of the content.
 *
 */
class ForteTable extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}

    this.activeRowId = null
    this.rowIndex = null

    //this.state.selectedCells = [ {col: 0, row: 3}, {col: 3, row: 0} ];
    this.dragStartCells = false

    if (props.createController)
      // if there is a controller factory, call it
      this.state.tableController = props.createController(this)
  }

  /** Sets the width for each column.
   *
   */
  componentWillMount() {
    const columnsWidth = this.props.columns().map((column, index) => {
      let columnWidth

      if (this.props.onColumnWidth)
        columnWidth = this.props.onColumnWidth(columnWidth, column)

      columnWidth = columnWidth || this.props.defaultColumnWidth || 150

      return columnWidth
    })
    this.setState({ columnsWidth: columnsWidth }) // puts in state the array with columns width
  }

  /**Callback invoked by ColumnHeader when resized.
   *
   * @param columnWidth - the new value of the column width after resizing
   * @param index - index of the column into model.
   * @param headerComponent - the headerColumn component that has been sized.
   * @return {*} the new value of the column width, eventually modified by a custom callback.
   */
  onColumnWidth(columnWidth, index, headerComponent) {
    let column = this.props.columns()[index]

    if (this.props.onColumnWidth)
      columnWidth = this.props.onColumnWidth(
        columnWidth,
        column,
        headerComponent
      )

    // updates the state... and redraws the table
    let columnsWidth = this.getState(columnsWidth) // gets the array of the columns width
    columnsWidth[index] = columnsWidth // updates the value in the corresponding position
    this.setState({ columnsWidth: columnsWidth }) // saves the array of columns width into state (and refresh the whole table)

    return columnWidth
  }

  /** Checks if new row is to be rendered
   *
   */
  componentDidUpdate() {}

  /**Sets a row as active. Memorizes the row index and eventually the row id.
   *
   * @param rowId
   * @param rowIndex
   */
  setActiveRow = (rowId, rowIndex) => {
    this.activeRowId = rowId
    this.rowIndex = rowIndex
  }

  onSelectionDragStart = cell => {
    this.dragStartCells = {
      col: cell.props.columnIndex,
      row: cell.props.rowIndex,
    }
    this.setState({ selectedCells: [this.dragStartCells] })
    return false
  }

  onSelectionDragMove = cell => {
    if (!this.dragStartCells)
      // if there is no started drag, exits
      return

    let selectedCells = [] // empties the selected value
    // TODO: selectedRows = {};

    // defines start and end coordinates: end should be > than start.
    // takes the min coordinates from starting cell and pointed cell
    let startCoord = {
      col: Math.min(this.dragStartCells.col, cell.props.columnIndex),
      row: Math.min(this.dragStartCells.row, cell.props.rowIndex),
    }
    // takes the max coordinates from starting cell and pointed cell
    let endCoord = {
      col: Math.max(this.dragStartCells.col, cell.props.columnIndex),
      row: Math.max(this.dragStartCells.row, cell.props.rowIndex),
    }

    // TODO: checks if useful
    // if drag selection ends where started, clears entire selection (?)
    // if( startCoord.col === endCoord.col && startCoord.row === endCoord.row ){
    //   this.setState( {selectedCells: []} );
    //   return true;
    // }

    for (let r = startCoord.row; r <= endCoord.row; r++) {
      for (let c = startCoord.col; c <= endCoord.col; c++) {
        selectedCells.push({ col: c, row: r })
        // console.log(`c: ${c}, r: ${r}`);
        // if( !selectedCells[ r ] )  selectedCells[ r ]= [];
        // selectedCells[ r ].push( c );
      }
    }

    this.setState({ selectedCells: selectedCells })
    return false
  }

  onSelectionDragEnd = cell => {
    this.dragStartCells = false
  }

  /**Renders ForteDataGrid component.
   * Composes a Toolbar, a table header and a table body.
   *
   * @returns {XML}
   */
  render() {
    const width = this.props.tableWidth
    const height = this.props.tableheight

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
    )
    const tableBody = (
      <TableBody
        rows={this.props.rows}
        columns={this.props.columns}
        cellRender={this.props.cellRender}
        cellStyle={this.props.cellStyle}
        cellClassName={this.props.cellClassName}
        columnsWidth={this.state.columnsWidth}
        headRowRender={this.props.headRowRender}
        tableController={this.state.tableController}
        getTableController={this.props.getTableController}
        type={this.props.type ? this.props.type : 'small'}
        setActiveRow={this.setActiveRow}
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
      />
    )
    const tableFooter = ''

    return (
      <div
        style={this.props.style}
        ref={b => {
          this.tableBody = b
        }}
      >
        {tableHeader}
        {tableBody}
      </div>
    )
  }
}

export default ForteTable
