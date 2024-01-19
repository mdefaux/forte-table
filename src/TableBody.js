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

  componentWillReceiveProps(update) {
    if (update.activeRowId === -1) {
      this.setState({ activeRow: update.activeRowId });
    }
  }

  newRowElement = null;

  setActiveRow = (row, rowIndex) => {
    debugger;
    // this.setState({ activeRow: rowId }, function() {
    //   this.props.setActiveRow(rowId, rowIndex);
    // });
  };

  rowMap(rowIndexes, columnRangeStart, columnRangeEnd) {
    return rowIndexes.map((dataRecord, index) => {
      // let isActive = false;
      // if (dataRecord.id === this.state.activeRow) {
      //   isActive = true;
      // }
      // checks if row is the active one comparing the active row index.
      let isActive = index === this.props.activeRowIndex;

      // checks if row is selected, looking for row index in selected object index
      let sel = this.props.selectedCells && this.props.selectedCells[index];
      let isSelected = !!sel; // converts null in boolean false and 'some value' into boolean true

      return (
        <TableRow
          isActive={isActive}
          saveData={this.props.saveData}
          // key={dataRecord.id ? dataRecord.id : index} // @TODO check key with dataRecord.id
          key={index} // @TODO check key with dataRecord.id
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
          selectedCells={sel}
          isSelected={isSelected}
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
