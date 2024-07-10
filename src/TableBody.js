import React from 'react';
import TableRow from './TableRow';
import styles from '../styles/table-body-styles';

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

  // componentWillReceiveProps(update) {
  //   if (update.activeRowId === -1) {
  //     this.setState({ activeRow: update.activeRowId });
  //   }
  // }

  newRowElement = null;

  setActiveRow = (row, rowIndex) => {
    debugger;
    // this.setState({ activeRow: rowId }, function() {
    //   this.props.setActiveRow(rowId, rowIndex);
    // });
  };

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
      // let isActive = false;
      // if (dataRecord.id === this.state.activeRow) {
      //   isActive = true;
      // }
      // checks if row is the active one comparing the active row index.
      let isActive = index === this.props.activeRowIndex;

      return (
        <TableRow
          isActive={isActive}
          saveData={this.props.saveData}
          // key={dataRecord.id ? dataRecord.id : index} // @TODO check key with dataRecord.id
          key={index} // @TODO check key with dataRecord.id
          // ref={(ref)=>this.onRowRendered( ref, index )}
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
          columnsWidth={this.props.columnsWidth}
          columnsWidthSum={this.props.columnsWidth.reduce((p, c) => c + p, 0)}
          headRowRender={this.props.headRowRender}
          headers={this.props.headers}
          setActiveRow={this.setActiveRow}
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

    const rows = this.rowMap(rowIndexes, 
      this.props.columnRangeStart, this.props.columnRangeEnd );
    // const rows = this.rowMap(rowIndexes);
    // const fixedRows = this.rowMap(rowIndexes, 0, 3);
    
    return <div style={{...styles.root,...this.props.style}}>{rows}</div>;

    // return <div style={{ position: 'relative'}}>
    // return <div style={{ display:'block' }}>
    // {/* return <> */}
    //   <div style={{...styles.root, position: 'absolute', left: '48px', }}>{rows}</div>
    //   <div style={{ // ...styles.root,
    //       position: 'sticky',
    //       left: '0px',
    //       zIndex: 100,
    //   }}>{fixedRows}</div>
    // </div>
    // </>
  }
}

export default TableBody;
