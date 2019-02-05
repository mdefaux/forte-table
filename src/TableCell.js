import React from 'react';
import '../styles/table-cell.css';

class TableCell extends React.Component {
  state = {
    input: false,
    tempContent: undefined, // TODO: handle edit mode
    isValid: true, // TODO: handle valid value
    isSelected: false,
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

  componentWillMount() {}

  /** Prevents Row to be re-rendered if it does not change selection state.
   *
   * @param nextProps - properties to be set
   * @returns {boolean} true if the row is been selected and wan not, or viceversa.
   */
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.isActive ||
      nextProps.isActive ||
      this.props.isSelected ||
      nextProps.isSelected ||
      nextState.hover !== this.state.hover
    );
  }

  setSelected = toBeSelected => {
    this.setState({ isSelected: toBeSelected });
    if (toBeSelected) {
      this.props.setActiveRow();
    }
  };

  onClick = e => {
    if (this.props.onCellClick)
      this.props.onCellClick(
        e,
        this.props.column,
        this.props.row,
        this.props.model,
        this
      );
    this.props.setActiveCell(this);
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
    if (this.props.onCellMouseDown)
      this.props.onCellMouseDown(
        e,
        this.props.column,
        this.props.row,
        this.props.model,
        this
      );
    // e.preventDefault();
    return this.props.onSelectionDragStart(this, e);
  };
  onMouseMove = e => {
    if (this.props.onCellMouseMove)
      this.props.onCellMouseMove(
        e,
        this.props.column,
        this.props.row,
        this.props.model,
        this
      );
    this.props.onSelectionDragMove(this, e);
  };
  onMouseUp = e => {
    if (this.props.onCellMouseUp)
      this.props.onCellMouseUp(
        e,
        this.props.column,
        this.props.row,
        this.props.model,
        this
      );
    this.props.onSelectionDragEnd(this, e);
  };
  onKeyDown = evt => {
    evt = evt || window.event;
    if (this.props.onCellKeyDown)
      this.props.onCellKeyDown(
        evt,
        this.props.column,
        this.props.row,
        this.props.model,
        this
      );
  };
  onKeyUp = evt => {
    evt = evt || window.event;
    // console.log(evt.which);
    if (this.props.onCellKeyUp)
      this.props.onCellKeyUp(
        evt,
        this.props.column,
        this.props.row,
        this.props.model,
        this
      );
  };

  getStyle() {
    if (this.props.cellStyle)
      return this.props.cellStyle(this.props.column, this.props.row, this);

    return this.state.isSelected
      ? 'ft-cell__container ft-cell__container--active'
      : 'ft-cell__container ft-cell__container--normal';
  }

  render() {
    let content = ' ';

    if (this.hasController() && this.state.input) {
      content = this.getController().getContent(
        this.props.column,
        this.props.row,
        this
      );
    } else if (this.props.cellRender)
      content = this.props.cellRender(this.props.column, this.props.row, this);
    let className =
      // this.state.isSelected || this.state.input // ft-cell__container ft-cell__container--active
      this.props.isActive
        ? 'ft-cell__container ft-cell__container--active'
        : 'ft-cell__container ft-cell__container--normal';
    if (this.props.cellClassName)
      className = this.props.cellClassName(
        className,
        this.props.column,
        this.props.row,
        this
      );
    let style = {};
    style = this.props.cellStyle
      ? this.props.cellStyle(style, this.props.column, this.props.row, this)
      : style;

    style.width = this.props.columnWidth;
    style.minWidth = this.props.columnWidth;
    style.maxWidth = this.props.columnWidth;

    // console.log(this.props.selectedCells);
    // if (this.props.selectedCells && !this.props.isActive) {
    //   // let coord = { col: this.props.columnIndex, row: this.props.rowIndex };
    //
    //   if (
    //     this.props.selectedCells.filter(
    //       o => o.col === this.props.columnIndex && o.row === this.props.rowIndex
    //     ).length
    //   ) {
    //     style.backgroundColor = '#BFBFFF';
    //   }
    // }

    if (this.props.isSelected && !this.props.isActive)
      style.backgroundColor = '#BFBFFF';

    return (
      <div
        className={className}
        style={style}
        // style={
        //   this.state.isSelected
        //     ? styles.container__active()
        //     : styles.container
        // }
        tabIndex={1}
        // style={styles.handleValidation(
        //   this.state.isValid,
        //   this.props.activeRow,
        //   this.props.fieldModel.mandatory,
        //   this.props.fieldModel.readonly
        // )}
        onClick={this.onClick}
        onDoubleClick={this.onDoubleClick}
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
        // onDragStart={(e) => {return !this.props.dragStartSelection(this,e);}}
        // onDrag={(e) => {return !this.props.dragEndSelection(this,e);}}
        draggable={false}
      >
        {content}
      </div>
    );
  }
}

export default TableCell;
