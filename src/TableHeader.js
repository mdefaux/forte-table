import React from "react";
import ColumnHeader from "./ColumnHeader";

import "../styles/table-header.css";

class TableHeader extends React.Component {
  mapColumns(columns) {
    return columns.map((col, index) => {
      let leftPos = columns.slice( 0, index ).reduce( 
        (acc,col)=> acc+ (col.userColumnWidth || col.defaultColumnWidth || 150),
         48+4 );

      return <ColumnHeader
        key={col.name || col || `header-${index}`}
        index={index}
        headColRender={this.props.headColRender}
        column={col}
        onColumnHeaderClick={this.props.onColumnHeaderClick}
        onColumnWidth={this.props.onColumnWidth}
        columnWidth={col.userColumnWidth || col.defaultColumnWidth || 150} 
        fixed={ this.props.columnRangeEnd && (index < this.props.columnRangeEnd) }
        left={ leftPos }
      />
    });
  }
  
  render() {
    const columns = this.props.columns();
    const headers = this.mapColumns(columns);

    return (
      <div className="ft-table--header--container" style={{
        ...this.props.style, 
        display: 'table-row',
      }}>
        <div className="ft-table--header--content"> </div>
        {headers}
      </div>
    );
  }
}

export default TableHeader;
