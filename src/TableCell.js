import React from 'react';
// import styles from '../styles/table-cell-styles';
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
    //this.cellController = this.props.rowController.createCellController( this, this.props.row, this.props.column );
  }

  /*
  handleKey = (evt) => {
    evt = evt || window.event;
    if (evt.keyCode === 27) {
      // Esc key pressed.
      this.setState({
        input: false,
        tempContent: this.props.value,
      });
    } else if (evt.keyCode === 13) {
      // Enter key pressed
      this.handleSave();
    }
  };
  */

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
    // console.log( evt.which );
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
    console.log(evt.which);
    if (this.props.onCellKeyUp)
      this.props.onCellKeyUp(
        evt,
        this.props.column,
        this.props.row,
        this.props.model,
        this
      );
  };

  render() {
    // let content = this.state.tempContent ? this.state.tempContent : this.props.value;

    // let content = /*this.state.tempContent ? this.state.tempContent :*/ this.props.controller.getCellContent( this.props.column, this.props.row, this );
    // let content = /*this.state.tempContent ? this.state.tempContent :*/ this.getController().getContent( this.props.column, this.props.row, this );
    if (this.hasController()) {
      return this.getController().getContent(
        this.props.column,
        this.props.row,
        this
      );
    }

    let content = ' ';
    if (this.props.cellRender)
      content = this.props.cellRender(
        this.props.column,
        this.props.row,
        this.props.model,
        this
      );

    return (
      <div
        className={
          this.state.isSelected
            ? 'ft-cell__container ft-cell__container--active'
            : 'ft-cell__container ft-cell__container--normal'
        }
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

    // return (content);
  }
}

export default TableCell;
