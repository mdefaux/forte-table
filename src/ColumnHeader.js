import React from 'react';
import '../styles/column-header-style.css';
import { isRegExp } from 'util';

class ColumnHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterActive: false,
      sortActive: false,
      sorting: null,
      hover: false,
      resized: false,
      startX: null,
      startColumnWidth: null,
      columnWidth: this.props.columnWidth,
    };

    this.onColumnWidth = this.onColumnWidth.bind(this);
    this.toggleHover = this.toggleHover.bind(this);
    this.handleColumnsResize = this.handleColumnsResize.bind(this);
    this.resizeColumns = this.resizeColumns.bind(this);
    this.removeListeners = this.removeListeners.bind(this);
  }

  toggleHover = () => {
    this.setState(prevState => {
      return {
        hover: !prevState.hover,
      };
    });
  };

  onColumnWidth(columnWidth) {
    columnWidth = this.props.onColumnWidth
      ? this.props.onColumnWidth(columnWidth, this.props.index, this)
      : columnWidth;

    columnWidth = columnWidth || this.props.defaultColumnWidth || 150;

    return columnWidth;
  }

  resizeColumns(event) {
    let diffWidth = event.pageX - this.state.startX;

    this.setState({
      resized: true,
      columnWidth: this.state.startColumnWidth + diffWidth,
    });
  }

  handleColumnsResize(event) {
    this.setState(
      {
        startX: event.pageX,
        startColumnWidth: this.state.columnWidth,
      },
      () => {
        document.addEventListener('mousemove', this.resizeColumns);
        document.addEventListener('mouseup', this.removeListeners);
      }
    );
  }

  removeListeners() {
    document.removeEventListener('mousemove', this.resizeColumns);
    document.removeEventListener('mouseup', this.handleColumnsResize);
  }

  render() {
    let content;
    if (this.props.headColRender)
      content = this.props.headColRender(this.props.column);
    else content = this.props.column;

    return (
      <div
        className='ft-table--cell__header'
        style={{
          width: this.state.resized
            ? this.state.columnWidth
            : this.props.columnWidth,
        }}
        onClick={() => {
          this.props.onColumnHeaderClick(this.props.index);
        }}
        onMouseEnter={this.toggleHover}
        onMouseLeave={this.toggleHover}
      >
        {content}
        <div
          className='ft-table--cell__header--resizable'
          onMouseDown={this.handleColumnsResize}
        />
      </div>
    );
  }
}

export default ColumnHeader;
