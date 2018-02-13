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

  render() {
    let content;
    if( this.props.headColRender )
      content = this.props.headColRender(this.props.column);
    else
      content = this.props.column;

    return (
      <div
        className="ft-table--cell__header"
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
