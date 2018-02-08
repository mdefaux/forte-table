import React from "react";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";

/** ForteDataGrid displays a table given a set of columns and a set of rows.
 *  Cells will receive the column and the row data to draw itself:
 *  redefine CellModel in order to customize the aspect of the content.
 *
 */
class ForteTable extends React.Component {
  state = {
  };

  activeRowId = null;
  rowIndex = null;


  constructor(props) {
    super(props);

    if (props.createController)
      // if there is a controller maker
      this.state.tableController = props.createController(this);
    console.log(this.state.tableController);
  }

  /** On initializing query the data store and sets table in loading state.
   *
   */
  componentWillMount() {
    // this.loadFromServer();
  }

  /** Checks if new row is to be rendered
   *
   */
  componentDidUpdate() {}


  setActiveRow = (rowId, tableName, rowIndex) => {
    this.activeRowId = rowId;
    this.rowIndex = rowIndex;
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
        changeSortColumn={this.changeSortColumn}
        sorting={this.state.sorting}
        loggedUser={this.props.loggedUser}
      />
    );
    const tableBody = (
      <TableBody
        rows={this.props.rows}
        columns={this.props.columns}
        cellRender={this.props.cellRender}
        headRowRender={this.props.headRowRender}
        tableController={this.state.tableController}
        getTableController={this.props.getTableController}
        type={this.props.type ? this.props.type : "small"}
        onCellClick={this.props.onCellClick}
        onCellDoubleClick={this.props.onCellDoubleClick}
        onCellMouseDown={this.props.onCellMouseDown}
        onCellMouseMove={this.props.onCellMouseMove}
        onCellMouseUp={this.props.onCellMouseUp}
      />
    );
    const tableFooter = "";

    return (
      <div
        style={this.props.style}
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
