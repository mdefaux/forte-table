import React from 'react';
import '../styles/table-cell.css';

class TableCell extends React.Component {
  state = {
    input: false,
    tempContent: null, // TODO: handle edit mode
    isValid: true, // TODO: handle valid value
    isSelected: false
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

  componentWillMount() {
  }

  setSelected = ( toBeSelected ) => {
    this.setState({ isSelected: toBeSelected });
    if( toBeSelected )
    {
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
    if( this.props.cellStyle )
      return this.props.cellStyle(
        this.props.column,
        this.props.row,
        this
      );

    return this.state.isSelected ?
        'ft-cell__container ft-cell__container--active'
        : 'ft-cell__container ft-cell__container--normal';
  };

  render() {

    let content = ' ';

    if (this.hasController() && this.state.input) {
      content = this.getController().getContent(
        this.props.column,
        this.props.row,
        this
      );
    } else if (this.props.cellRender)
      content = this.props.cellRender(
        this.props.column,
        this.props.row,
        this
      );
    let className = this.state.isSelected || this.state.input ? // ft-cell__container ft-cell__container--active
      'ft-cell__container ft-cell__container--active'
      : 'ft-cell__container ft-cell__container--normal';
    if( this.props.cellClassName )
      className = this.props.cellClassName( className, this.props.column,this.props.row,this);
    let style = {};
    style = this.props.cellStyle ? this.props.cellStyle( style, this.props.column,this.props.row,this) : style;

    style.width = this.props.columnWidth;
    style.minWidth = this.props.columnWidth;
    style.maxWidth = this.props.columnWidth;

    return (
      <div
        className={ className }
        style={ style }
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
      >
        {content}
      </div>
    );
  }
}

export default TableCell;
