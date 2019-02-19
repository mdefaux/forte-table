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

class TableRow extends React.Component {
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

  componentWillMount() {
    // console.log("Row will mount");
    // this.rowController = this.getController(); // this.props.tableController.createRowController( this, this.props.row );
  }

  /** Prevents Row to be re-rendered if it does not change selection state.
   *
   * @param nextProps - properties to be set
   * @returns {boolean} true if the row is been selected and wan not, or viceversa.
   */
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.isActive ||
      nextProps.isActive ||
      this.props.isSelected ||
      nextProps.isSelected ||
      nextState.hover !== this.state.hover
    );
  }

  handleRowHover = () => {
    this.setState(prevState => ({
      hover: !prevState.hover,
    }));
  };

  setActiveRow = rowId => {
    this.props.setActiveRow(rowId, this.props.index);
  };

  headRowRender(row) {
    return (
      <div
        style={{
          // visibility: this.props.isActive ? 'visible' : 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '29px',
          height: styles.selectHeight(this.props.type),
          borderLeft:
            this.props.isActive && !this.props.newRow
              ? '3px solid #108ee9'
              : this.props.newRow ? '3px solid #00a854' : '',
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

    if (row._subscribe) {
      row._subscribe(this);
    }
    // debugger;
    let rowData = row._getData ? row._getData() : row;

    const columns = this.props.columns();
    const cells = columns.map((/*headerModel*/ column, index) => {
      // for each column in the view
      // TODO: copies the model of the field into a local value
      let isSelected = !!(
        this.props.selectedCells && this.props.selectedCells[index]
      );
      let isActive = this.props.isActive && index === this.props.activeColIndex;

      return (
        <TableCell
          key={index}
          index={index}
          rowId={this.props.rowId}
          activeRow={this.props.isActive}
          setActiveRow={this.setActiveRow}
          setActiveCell={this.props.setActiveCell}
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
          cellClassName={this.props.cellClassName}
          selectedCells={this.props.selectedCells}
          isSelected={isSelected}
          isActive={isActive}
          onSelectionDragStart={this.props.onSelectionDragStart}
          onSelectionDragMove={this.props.onSelectionDragMove}
          onSelectionDragEnd={this.props.onSelectionDragEnd}
          columnWidth={this.props.columnsWidth[index]}
          getRowController={this.getController}
        />
      );
    });

    const headRow = this.props.headRowRender
      ? this.props.headRowRender(row)
      : this.headRowRender(row);

    return (
      <div
        style={{
          ...styles.root,
          height: styles.selectHeight(this.props.type),
        }}
        // onMouseEnter={this.props.hover ? this.handleRowHover : ""}
        // onMouseLeave={this.props.hover ? this.handleRowHover : ""}
      >
        {headRow}
        {cells}
      </div>
    );
  }
}

export default TableRow;
