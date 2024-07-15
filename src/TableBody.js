import React from 'react';
import TableRow from './TableRow';
import styles from '../styles/table-body-styles';
import Record from '../../forte-form/forte-store/Record';

class TableBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeRow: -20,
      range: {
        start: false,
        end: false,
      },
    };
  }

  newRowElement = null;

  onRowRendered( row, index ) {
    if ( this.rows[ index ] === row ) {
      return;
    }

    this.rows[ index ] = row;

    if ( this.rows.length < this.rowsCount ) {
      return;
    }

    if ( this.rowsRendered ) {
      return;
    }

    for( let i=0; i < this.rowsCount.length; i++ ) {
      if ( !this.rows ) {
        return;
      }
    }

    this.props.onRowsRendered( this.rows );
    this.rowsRendered = true;
  }

  rowMap(rowIndexes, columnRangeStart, columnRangeEnd) {
    this.rows = [];
    this.rowsCount = rowIndexes.length;
    this.rowsRendered = false;

    return rowIndexes.map((dataRecord, index) => {
      // checks if row is the active one comparing the active row index.
      let isActive = index === this.props.activeRowIndex;
      let cellErrors = [];
      
      if (dataRecord instanceof Record) {
        cellErrors = dataRecord.getErrors()
      }

      return (
        <TableRow
          isActive={isActive}
          saveData={this.props.saveData}
          key={index} // @TODO check key with dataRecord.id
          onRowRendered={(ref)=>this.onRowRendered( ref, index )}
          rowId={dataRecord.id}
          index={index}
          tableController={this.props.tableController}
          getTableController={this.props.getTableController}
          row={dataRecord}
          columns={this.props.columns}
          columnCount={this.props.columns().length}
          columnRangeStart={columnRangeStart}
          columnRangeEnd={columnRangeEnd}
          cellRender={this.props.cellRender}
          cellStyle={this.props.cellStyle}
          cellClassName={this.props.cellClassName}
          cellErrors={cellErrors}
          columnsWidth={this.props.columnsWidth}
          columnsWidthSum={this.props.columnsWidth.reduce((p, c) => c + p, 0)}
          headRowRender={this.props.headRowRender}
          headers={this.props.headers}
          activeRowIndex={this.props.activeRowIndex}
          activeColIndex={this.props.activeColIndex}
          onCellClick={this.props.onCellClick}
          onCellDoubleClick={this.props.onCellDoubleClick}
          onCellMouseDown={this.props.onCellMouseDown}
          onCellMouseMove={this.props.onCellMouseMove}
          onCellMouseUp={this.props.onCellMouseUp}
          onCellKeyDown={this.props.onCellKeyDown}
          onCellKeyUp={this.props.onCellKeyUp}
          setActiveCell={this.props.setActiveCell}
          onSelectionDragStart={this.props.onSelectionDragStart}
          onSelectionDragMove={this.props.onSelectionDragMove}
          onSelectionDragEnd={this.props.onSelectionDragEnd}
          type={this.props.type}
          hover={this.props.hover}
          reload={this.props.reload}
          checkNewRow={this.props.newRow}
          loggedUser={this.props.loggedUser}
          notifyActiveCell={this.props.notifyActiveCell}
          readOnly={this.props.readOnly} />
      );
    });
  }

  render() {
    let rowIndexes = this.props.rows(
      this.state.range.start,
      this.state.range.end
    );

    const rows = this.rowMap( rowIndexes, this.props.columnRangeStart, this.props.columnRangeEnd );
    
    return <div style={{...styles.root,...this.props.style}}>{rows}</div>;
  }
}

export default TableBody;
