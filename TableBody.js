import React from "react";
import TableRow from "./TableRow";
import styles from "./styles/table-body-styles";

class TableBody extends React.Component {
  state = {
    activeRow: -20
  };

  componentWillReceiveProps(update) {
    if (update.activeRowId === -1) {
      this.setState({ activeRow: update.activeRowId });
    }
  }

  newRowElement = null;

  setActiveRow = (rowId, rowIndex) => {
    this.setState({ activeRow: rowId }, function() {
      // console.log(this.state.activeRow);
      this.props.setActiveRow(rowId, this.props.model.table, rowIndex);
    });
  };

  // deleteRow = () => {
  //     console.log('deleteRow in tableBody');
  //     console.log(this.state.activeRow);
  //
  //     this.props.deleteRow(this.state.activeRow);
  // };

  render() {
    // let data = this.props.data;
    // let rowIndexes = this.props.store.getRows(this.props.model.table);
    // let rowIndexes = this.props.tableController.getRows();
    let rowIndexes = this.props.rows();
    const rows = rowIndexes.map((dataRecord, index) => {
      // let dataRecord = this.props.store.getRecord(
      //   this.props.model.table,
      //   valueIndex
      // );
      let isActive = false;
      if (dataRecord.id === this.state.activeRow) {
        isActive = true;
      }

      return (
        <TableRow
          setActiveRow={this.setActiveRow}
          isActive={isActive}
          saveData={this.props.saveData}
          key={dataRecord.id}
          rowId={dataRecord.id}
          index={index}
          // dataRecord={dataRecord}
          tableController={this.props.tableController}
          getTableController={this.props.getTableController}
          row={dataRecord}
          columns={this.props.columns}
          cellRender={this.props.cellRender}
          headers={this.props.headers}

          onCellClick={this.props.onCellClick}
          onCellDoubleClick={this.props.onCellDoubleClick}
          onCellMouseDown={this.props.onCellMouseDown}
          onCellMouseMove={this.props.onCellMouseMove}
          onCellMouseUp={this.props.onCellMouseUp}

          // getDataList={this.props.getDataList}
          model={this.props.model}
          view={this.props.view}
          store={this.props.store}
          type={this.props.type}
          hover={this.props.hover}
          reload={this.props.reload}
          checkNewRow={this.props.newRow}
          // pushNotify={this.props.pushNotify}
          // clearNotify={this.props.clearNotify}
          // removeNotify={this.props.removeNotify}
          loggedUser={this.props.loggedUser}
        />
      );
    });

    if (this.props.newRow) {
      let newIsActive = false;
      if (this.state.activeRow === -1) {
        newIsActive = true;
      }

      /*
      return (
        <div style={styles.root}>
          {rows}

          */
      let newRow = (
        <TableRow
          tableModel={this.props.tableModel}
          setActiveRow={this.setActiveRow}
          isActive={newIsActive}
          saveData={this.props.saveData}
          key={-1}
          rowId={-1}
          index={rowIndexes.length}
          // dataRecord={dataRecord}
          headers={this.props.headers}
          // getDataList={this.props.getDataList}
          model={this.props.model}
          view={this.props.view}
          store={this.props.store}
          type={this.props.type}
          hover={this.props.hover}
          newRow={true}
          reload={this.props.reload}
          ref={input => {
            this.newRowElement = input;
          }}
          // pushNotify={this.props.pushNotify}
          // clearNotify={this.props.clearNotify}
          // removeNotify={this.props.removeNotify}
          loggedUser={this.props.loggedUser}
        />
      );
      rows.push(newRow);
    }
    // else {
    return <div style={styles.root}>{rows}</div>;
    // }
  }
}

export default TableBody;
