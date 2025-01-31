import React from 'react';
import '../styles/table-cell.css';

class TableCell extends React.Component {
  state = {
    //   input: false,
    //   tempContent: undefined, // TODO: handle edit mode
    //   isValid: true, // TODO: handle valid value
  };

  cellController = null;

  hasController = () => {
    return this.cellController;
  };

  getController = () => {
    if (!this.hasController())
      this.cellController = this.props
        .getRowController()
        .createCellController(this, this.props.row, this.props.column);
    return this.cellController;
  };

  setActive() {
    this.props.setActiveCell(this);
  }

  onClick = e => {
    if (this.props.onCellClick)
      this.props.onCellClick(
        e,
        this.props.column,
        this.props.row,
        this.props.model,
        this
      );
    this.setActive();
  };

  onDoubleClick = e => {
    if (this.props.onCellDoubleClick)
      this.props.onCellDoubleClick(
        e,
        this.props.column,
        this.props.row,
        this.props.model,
        this
      );
  };
  onMouseDown = e => {
    if (e.button === 1) {
      return;
    }

    if (this.props.onCellMouseDown) {
      this.props.onCellMouseDown(
        e,
        this.props.column,
        this.props.row,
        this.props.model,
        this
      );
    }

    this.setActive();

    return this.props.onSelectionDragStart(this, e);
  };

  onMouseMove = e => {
    if (this.props.onCellMouseMove) {
      this.props.onCellMouseMove(
        e,
        this.props.column,
        this.props.row,
        this.props.model,
        this
      );
    }

    this.props.onSelectionDragMove(this, e);
  };

  onMouseUp = e => {
    if (this.props.onCellMouseUp) {
      this.props.onCellMouseUp(
        e,
        this.props.column,
        this.props.row,
        this.props.model,
        this
      );
    }

    this.props.onSelectionDragEnd(this, e);
  };

  onKeyDown = evt => {
    evt = evt || window.event;
    
    if (this.props.onCellKeyDown) {
      this.props.onCellKeyDown(
        evt,
        this.props.column,
        this.props.row,
        this.props.model,
        this
      );
    }
  };

  onKeyUp = evt => {
    evt = evt || window.event;

    if (this.props.onCellKeyUp) {
      this.props.onCellKeyUp(
        evt,
        this.props.column,
        this.props.row,
        this.props.model,
        this
      );
    }
  };

  render() {
    let content = ' ';

    if (this.props.cellRender)
      content = this.props.cellRender(this.props.column, this.props.row, this);

    // sets active class if cell has active property
    let className =
      this.props.isActive
        ? this.props.column.nobordercell
          ? 'ft-cell__container '
          : 'ft-cell__container ft-cell__container--active disable-selection'
        : this.props.column.nobordercell
          ? 'ft-cell__container '
          : 'ft-cell__container ft-cell__container--normal disable-selection';
    
    if (this.props.cellClassName) {
      className = this.props.cellClassName(
        className,
        this.props.column,
        this.props.row,
        this
      );
    }

    let style = {};
    
    style = this.props.cellStyle
      ? this.props.cellStyle(style, this.props.column, this.props.row, this)
      : style;

    // sets height and width of the cell
    style.width = this.props.columnWidth;
    style.minWidth = this.props.columnWidth;
    style.maxWidth = this.props.columnWidth;

    style = {...this.props.style, ...style }

    // sets background color for selected cells
    if (this.props.isSelected) {
      style.backgroundColor = '#BFBFFF';
      className += ' ft-cell-selected';
    }

    return (
      <div
        className={className}
        title={this.props.errorText}
        style={style}
        onClick={this.onClick}
        onDoubleClick={this.onDoubleClick}
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
        draggable={false}
        ref={ref => (this.ref = ref)}
      >
        {content}
      </div>
    );
  }
}

export default TableCell;
