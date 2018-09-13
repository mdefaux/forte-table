import React from "react";
import "../styles/column-header-style.css";

class ColumnHeader extends React.Component {
  state = {
    filterActive: false,
    sortActive: false,
    sorting: null,
    hover: false
  };

  toggleHover = () => {
    this.setState(prevState => {
      return {
        hover: !prevState.hover
      };
    });
  };


  onColumnWidth( columnWidth ) {

    columnWidth = this.props.onColumnWidth ?
      this.props.onColumnWidth( columnWidth, this.props.index, this )
      : columnWidth;

    columnWidth =  columnWidth || this.props.defaultColumnWidth || 150;

    return columnWidth;
  }

  render() {
    let content;
    if( this.props.headColRender )
      content = this.props.headColRender(this.props.column);
    else
      content = this.props.column;

    let style = {};

    style.width = this.props.columnWidth; // this.onColumnWidth();
    style.minWidth = this.props.columnWidth;
    style.maxWidth = this.props.columnWidth;
    // console.log(style);

    return (
      <div
        className="ft-table--cell__header"
        style={style}
        onClick={() => {
          this.props.onColumnHeaderClick(this.props.index);
        }}
        onMouseEnter={this.toggleHover}
        onMouseLeave={this.toggleHover}
      >
        {content}
      </div>
    );
  }
}

export default ColumnHeader;
