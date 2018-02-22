import config from './config-styles';

export default {
  container: {
    display: 'table-cell',
    border: '1px solid #dde1e3',
    /* border-top: 1px solid #dde1e3;
    border-left: 1px solid #dde1e3; */
    paddingLeft: '4px',
    minWidth: '150px',
    maxWidth: '150px',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    boxSizing: 'border-box',
    verticalAlign: 'middle',
    position: 'relative'
  },
  container__active: () => {
    return {
      ...this.container,
      minWidth: '149px',
      maxWidth: '149px',
      marginLeft: '-1px',
      border: '1px double #108EE9'
    };
  },
  handleValidation: (valid, activeRow, mandatory, readonly) => {
    // if (activeRow && mandatory && valid) {
    //   return "ft-cell--content__normal";
    // } else if (activeRow && readonly) {
    //   return "ft-cell--content__active-readonly";
    // }

    if (activeRow && readonly) {
      return 'ft-cell__content--active--readonly';
    } else if (activeRow && mandatory && valid) {
      return 'ft-cell__content--normal';
    } else if (!valid && mandatory) {
      return 'ft-cell__content--notvalid--mandatory';
      // background: "#fef0ef",
    } else if (!valid) {
      return 'ft-cell__content--notvalid';
    } else {
      return 'ft-cell__content--normal';
    }
  },
  selectHeight: type => {
    return config.cell.type[type].height;
  },
  handleDirection: direction => {
    if (direction === 'up') {
      return { borderTopStyle: 'hidden' };
    } else {
      return { borderBottomStyle: 'hidden' };
    }
  }
};
