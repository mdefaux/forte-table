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

  setActiveRow = (rowId, rowIndex) => {
    this.setState({ activeRow: rowId }, function() {
      this.props.setActiveRow(rowId, rowIndex);
    });
  };

  render() {
    let rowIndexes = this.props.rows(
      this.state.range.start,
      this.state.range.end
    );
    const rows = rowIndexes.map((dataRecord, index) => {
      // let isActive = false;
      // if (dataRecord.id === this.state.activeRow) {
      //   isActive = true;
      // }

      let isActive = index === this.props.activeRowIndex;

      // console.log(this.props.selectedCells);
      let sel = this.props.selectedCells && this.props.selectedCells[index];
      let isSelected = !!sel;
      // console.log(sel);
      // debugger;

      return (
        <TableRow
          isActive={isActive}
          saveData={this.props.saveData}
          key={dataRecord.id ? dataRecord.id : index} // @TODO check key with dataRecord.id
          rowId={dataRecord.id}
          index={index}
          tableController={this.props.tableController}
          getTableController={this.props.getTableController}
          row={dataRecord}
          columns={this.props.columns}
          cellRender={this.props.cellRender}
          cellStyle={this.props.cellStyle}
          cellClassName={this.props.cellClassName}
          columnsWidth={this.props.columnsWidth}
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
        />
      );
    });

    /*
    if (this.props.newRow) {
      let newIsActive = false;
      if (this.state.activeRow === -1) {
        newIsActive = true;
      }
      let newRow = (
        <TableRow
          // tableModel={this.props.tableModel}
          isActive={newIsActive}
          saveData={this.props.saveData}
          key={-1}
          rowId={-1}
          index={rowIndexes.length}


          tableController={this.props.tableController}
          getTableController={this.props.getTableController}
          // row={dataRecord}
          columns={this.props.columns}
          cellRender={this.props.cellRender}
          headers={this.props.headers}
          setActiveRow={this.setActiveRow}

          onCellClick={this.props.onCellClick}
          onCellDoubleClick={this.props.onCellDoubleClick}
          onCellMouseDown={this.props.onCellMouseDown}
          onCellMouseMove={this.props.onCellMouseMove}
          onCellMouseUp={this.props.onCellMouseUp}
          onCellKeyDown={this.props.onCellKeyDown}
          onCellKeyUp={this.props.onCellKeyUp}

          type={this.props.type}
          hover={this.props.hover}
          reload={this.props.reload}
          checkNewRow={this.props.newRow}
          loggedUser={this.props.loggedUser}



          // model={this.props.model}
          // view={this.props.view}
          // store={this.props.store}
          // type={this.props.type}
          // hover={this.props.hover}
          newRow={true}
          // reload={this.props.reload}
          ref={input => {
            this.newRowElement = input;
          }}
          // loggedUser={this.props.loggedUser}
        />
      );
      rows.push(newRow);
    }
    */
    return <div style={styles.root}>{rows}</div>;
  }
}

export default TableBody;
