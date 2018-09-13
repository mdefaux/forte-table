import React from "react";
import ColumnHeader from "./ColumnHeader";

import "../styles/table-header.css";

class TableHeader extends React.Component {
  render() {
    const headers = this.props.columns().map((col, index) => (
      <ColumnHeader
        key={index}
        index={index}
        headColRender={this.props.headColRender}
        column={col}
        onColumnHeaderClick={this.props.onColumnHeaderClick}
        onColumnWidth={this.props.onColumnWidth}
        columnWidth={this.props.columnsWidth[index]}
        // changeSortColumn={this.props.changeSortColumn}
        // sorting={this.props.sorting}
      />
    ));

    return (
      <div className="ft-table--header--container">
        <div className="ft-table--header--content" />
        {headers}
      </div>
    );
  }
}

export default TableHeader;
