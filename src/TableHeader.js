import React from "react";
import ColumnHeader from "./ColumnHeader";

import "../styles/table-header.css";

class TableHeader extends React.Component {
  render() {

    const fixedCount = 3;
    const columns = this.props.columns();

    const fixedColumns = columns.slice( 0, fixedCount );
    const scrollabledColumns = columns;

    const scrollableHeaders = scrollabledColumns.map((col, index) => (
      <ColumnHeader
        // key={index}
        key={col.name}
        index={index}
        headColRender={this.props.headColRender}
        column={col}
        onColumnHeaderClick={this.props.onColumnHeaderClick}
        onColumnWidth={this.props.onColumnWidth}
        columnWidth={col.userColumnWidth || col.defaultColumnWidth || 150}
        // columnWidth={this.props.columnsWidth[index]}
        // changeSortColumn={this.props.changeSortColumn}
        // sorting={this.props.sorting}
      />
    ));
    const fixedHeaders = fixedColumns.map((col, index) => (
      <ColumnHeader
        // key={index}
        key={col.name}
        index={index}
        headColRender={this.props.headColRender}
        column={col}
        onColumnHeaderClick={this.props.onColumnHeaderClick}
        onColumnWidth={this.props.onColumnWidth}
        columnWidth={col.userColumnWidth || col.defaultColumnWidth || 150}
        // columnWidth={this.props.columnsWidth[index]}
        // changeSortColumn={this.props.changeSortColumn}
        // sorting={this.props.sorting}
      />
    ));

    return (
      <div className="ft-table--header--container">
        <div className="ft-table--header--content" />
        <div style={{
          position: 'absolute',
          left: '48px'
        }}>

          {scrollableHeaders}
        </div>
        <div style={{
          position: 'sticky',
          left: '0px'
        }}>
          
          {fixedHeaders}
        </div>
      </div>
    );
  }
}

export default TableHeader;
