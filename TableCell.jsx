import React from 'react';

class TableCell extends React.Component {
  state = {
    input: false,
    tempContent: null,  // TODO: handle edit mode
    // isValid: true, // TODO: handle valid value
  };

  cellController = null;

  hasController = () => {
    return this.cellController;
  };

  getController = () => {
    if( !this.hasController() )
      this.cellController = this.props.getRowController().createCellController( this, this.props.row, this.props.column );
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

  render() {

    // let content = this.state.tempContent ? this.state.tempContent : this.props.value;

    // let content = /*this.state.tempContent ? this.state.tempContent :*/ this.props.controller.getCellContent( this.props.column, this.props.row, this );
    // let content = /*this.state.tempContent ? this.state.tempContent :*/ this.getController().getContent( this.props.column, this.props.row, this );

    let content = " ";
    if( this.props.cellRender )
      content = this.props.cellRender( this.props.row, this.props.column, this.props.model );

    return (
      <div
        className="ft-cell--container"
        // style={styles.handleValidation(
        //   this.state.isValid,
        //   this.props.activeRow,
        //   this.props.fieldModel.mandatory,
        //   this.props.fieldModel.readonly
        // )}
      >
          {content}
      </div>
    );

    // return (content);
  }
}

export default TableCell;
