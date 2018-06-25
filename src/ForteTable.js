import React from "react";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";

/** ForteDataGrid displays a table given a set of columns and a set of rows.
 *  Cells will receive the column and the row data to draw itself:
 *  redefine CellModel in order to customize the aspect of the content.
 *
 */
class ForteTable extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
    };
    this.activeRowId = null;
    this.rowIndex = null;

    if (props.createController)
      // if there is a controller factory, call it
      this.state.tableController = props.createController(this);
  }

  /** On initializing query the data store and sets table in loading state.
   *
   */
  componentWillMount() {
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
        onColumnHeaderClick={this.props.onColumnHeaderClick || ((index)=>{}) }
        // changeSortColumn={this.changeSortColumn}
        sorting={this.state.sorting}
        loggedUser={this.props.loggedUser}
      />
    );
    const tableBody = (
      <TableBody
        rows={this.props.rows}
        columns={this.props.columns}
        cellRender={this.props.cellRender}
        cellStyle={this.props.cellStyle}
        headRowRender={this.props.headRowRender}
        tableController={this.state.tableController}
        getTableController={this.props.getTableController}
        type={this.props.type ? this.props.type : "small"}
        setActiveRow={this.setActiveRow}
        onCellClick={this.props.onCellClick}
        onCellDoubleClick={this.props.onCellDoubleClick}
        onCellMouseDown={this.props.onCellMouseDown}
        onCellMouseMove={this.props.onCellMouseMove}
        onCellMouseUp={this.props.onCellMouseUp}
        onCellKeyDown={this.props.onCellKeyDown}
        onCellKeyUp={this.props.onCellKeyUp}

        newRow={this.props.newRow}
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
