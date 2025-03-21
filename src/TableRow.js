import React from 'react';
import TableCell from './TableCell';
import styles from '../styles/table-row-styles';

/**
 * TableRow
 * ========
 *
 *  Stylesheet file:
 *  - ./styles/table-row-styles
 */

/** Class TableRow renders a row of the table: is a parent of more TableCell.
 *  TableRow is child of TableBody from which take this properties:
 *
 */

class TableRow extends React.PureComponent {
  state = {
    isValid: true, // / true if the record has valid data, false if there is some error. False prevent record to be saved
    _loading: false,
    hover: false,
  };

  rowController = null;

  hasController = () => {
    return this.rowController;
  };

  getController = () => {
    if (!this.hasController())
      this.rowController = this.props
        .getTableController()
        .createRowController(this, this.props.row);
    return this.rowController;
  };

  componentDidMount() {
    this.props.onRowRendered( this );
  }

  componentDidUpdate() {
    this.props.onRowRendered( this );
  }

  /** Prevents Row to be re-rendered if it does not change selection state.
   *
   * @param nextProps - properties to be set
   * @returns {boolean} true if the row is been selected and wan not, or viceversa.
   */
  // shouldComponentUpdate(nextProps, nextState) {
  //   return (
  //     this.props.isActive ||
  //     nextProps.isActive ||
  //     this.props.isSelected ||
  //     nextProps.isSelected ||
  //     nextState.hover !== this.state.hover ||
  //     nextProps.index !== this.props.index
  //   );
  // }

  handleRowHover = () => {
    this.setState(prevState => ({
      hover: !prevState.hover,
    }));
  };

  setActive( active, activeColIndex ) {
    this.setState({
      active: active,
      activeColIndex: activeColIndex,
    });
  }

  selectCells( selectedCells ) {
    this.setState( { selectedCells: selectedCells } );
  }

  headRowRender(row) {
    return (
      <div
        style={{
          // visibility: this.props.isActive ? 'visible' : 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '29px',
          height: this.props.row.forteHeight ? this.props.row.forteHeight + 'px' : styles.selectHeight(this.props.type),
          borderLeft:
            this.props.isActive && !this.props.newRow
              ? '3px solid #108ee9'
              : this.props.newRow
              ? '3px solid #00a854'
              : '',
        }}
      >
        {this.state.id === -1 && !this.state.valid ? (
          ''
        ) : this.state.id === -1 && this.state.valid ? (
          <span style={{ color: '#f04134' }}>&#10006;</span>
        ) : !this.state.isValid ? (
          <span style={{ color: '#f04134' }}>&#10006;</span>
        ) : this.state.isValid && this.props.isActive ? (
          <span style={{ color: '#00a854' }}>&#10003;</span>
        ) : (
          <span />
        )}
      </div>
    );
  }

  /** Renders component
   *
   * @returns {XML}
   */
  render() {
    let row;
    // if( this.hasController() )                 // gets the record from controller
    //   row = this.getController().getRecord();
    // else
    row = this.props.row; // this.getRecord();

    // subscribes only if this block of cloumns is not fixed TODO: change subscription model
    if (row._subscribe /*&& !this.props.columnRangeEnd*/ ) {
      row._subscribe(this);
    }

    let rowData = row._getData ? row._getData() : row;

    const errors = this.props.cellErrors;

    const cellErrors = [...new Set(errors.map(e => e.column))]
    const columns = this.props.columns(); // .slice( this.props.columnRangeStart, this.props.columnRangeEnd );
    const cells = columns.map((/*headerModel*/ column, index) => {
      // for each column in the view
      // TODO: copies the model of the field into a local value
      let isSelected = !!(
        this.state.selectedCells && this.state.selectedCells[index]
      );
      // let isActive = this.props.isActive && index === this.state.activeColIndex;
      let isActive = index === this.state.activeColIndex;

      // calculate column width
      const columnWidth = (col,index) => (
        (col.userColumnWidth || col.defaultColumnWidth || this.props.columnsWidth[index] || 150)
      )

      let leftPos = columns.slice( 0, index ).reduce( 
        (acc,col)=> acc+ columnWidth(col,index),
         48+4 );

      let cellError = cellErrors.includes(column.name);

      let errorText;

      if (cellError) {
        let filteredErrors = errors.filter(e => e.column == column.name);
        errorText = filteredErrors.reduce(
          (text, error) => (text += `${error.msg}\n`),
          ""
        )
      }

      let border = cellError ? "1px solid red" : "";
      
      return (
        <TableCell
          // key={index}
          key={column.name || column || `cell-${index}`}
          index={index}
          rowId={this.props.rowId}
          activeRow={this.state.active}
          // setActiveRow={this.setActiveRow}
          setActiveCell={(cellComponent)=>this.props.setActiveCell(cellComponent,this)}
          onCellClick={this.props.onCellClick}
          onCellDoubleClick={this.props.onCellDoubleClick}
          onCellMouseDown={this.props.onCellMouseDown}
          onCellMouseMove={this.props.onCellMouseMove}
          onCellMouseUp={this.props.onCellMouseUp}
          onCellKeyDown={this.props.onCellKeyDown}
          onCellKeyUp={this.props.onCellKeyUp}
          type={this.props.type ? this.props.type : 'small'}
          model={this.props.model}
          column={column}
          row={rowData}
          columnIndex={index}
          rowIndex={this.props.index}
          cellRender={this.props.cellRender}
          cellStyle={this.props.cellStyle}
          style={{
            ...index < this.props.columnRangeEnd ? { 
              position: 'sticky', left: `${leftPos}px`, zIndex: '2', 
              backgroundColor: 'white', border: border } : { border: border }
          }}
          cellClassName={this.props.cellClassName}
          selectedCells={this.state.selectedCells}
          isSelected={isSelected}
          isActive={isActive}
          errorText={errorText}
          onSelectionDragStart={this.props.onSelectionDragStart}
          onSelectionDragMove={this.props.onSelectionDragMove}
          onSelectionDragEnd={this.props.onSelectionDragEnd}
          columnWidth={ columnWidth(column,index) }
          getRowController={this.getController}
          notifyActiveCell={this.props.notifyActiveCell}
        />
      );
    });

    const isActive = this.state.active; // this.props.isActive;
    const headRow = this.props.headRowRender
      ? this.props.headRowRender(row)
      : this.headRowRender(row);

    return (
      <div
        style={{
          ...styles.root,
          // active row is over others
          // so avoid children component to go behind next rows
          // https://stackoverflow.com/questions/5218927/z-index-not-working-with-fixed-positioning
          zIndex: isActive ? '2' : '1',
          height: styles.selectHeight(this.props.type),
        }}
        // onMouseEnter={this.props.hover ? this.handleRowHover : ""}
        // onMouseLeave={this.props.hover ? this.handleRowHover : ""}
      >
        <div className='row-heading'
          style={{  // row heading
            position: 'sticky',
            background: 'white',
            left: '0px',
            width: '48px',
            border: 'solid 1px white',
            display: 'table-cell',
            zIndex: 2,
            // paddingRight: '6px',
          }}
        >

          {headRow}
        </div>
        {cells}
      </div>
    );
  }
}

export default TableRow;
