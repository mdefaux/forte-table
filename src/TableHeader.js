import React from "react";
import ColumnHeader from "./ColumnHeader";

import "../styles/table-header.css";

class TableHeader extends React.Component {

  mapColumns(columns) {
    return columns.map((col, index) => {
      

      let leftPos = columns.slice( 0, index ).reduce( 
        (acc,col)=> acc+ (col.userColumnWidth || col.defaultColumnWidth /*|| forteWidth */ || 150),
         48+4 );

      return <ColumnHeader
        // key={index}
        key={col.name}
        index={index}
        headColRender={this.props.headColRender}
        column={col}
        onColumnHeaderClick={this.props.onColumnHeaderClick}
        onColumnWidth={this.props.onColumnWidth}
        columnWidth={col.userColumnWidth || col.defaultColumnWidth || 150} 
        // inactive={ this.props.columnInactiveCount && 
        //   (index < this.props.columnInactiveCount) }
        fixed={ this.props.columnRangeEnd && 
          (index < this.props.columnRangeEnd) }
        left={ leftPos }
      />
    });
  }
  
  render() {
    const columns = this.props.columns();
    // const columns = this.props.columns().slice( this.props.columnRangeStart, this.props.columnRangeEnd );
    // const fixedColumns = this.props.columns().slice( this.props.columnRangeStart, this.props.columnRangeEnd );

    const headers = this.mapColumns(columns);
    // const fixedHeaders = this.mapColumns(fixedColumns);

    return (
      <div className="ft-table--header--container" style={{
        ...this.props.style, 
        display: 'table-row',
      }}>
        <div className="ft-table--header--content"> </div>
        {/* <div style={{
          // position: 'absolute',
          left: '48px'
        }}> */}
          {headers}
        {/* </div> */}


        {/* <div style={{
          position: 'sticky',
          left: '0px',
          zIndex: '200'
        }}>
          
          {fixedHeaders}
        </div> */}


      </div>
    );
  }
}

export default TableHeader;
