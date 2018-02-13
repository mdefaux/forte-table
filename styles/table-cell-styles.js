import config from "./config-styles";

export default {
  handleValidation: (valid, activeRow, mandatory, readonly) => {
    // if (activeRow && mandatory && valid) {
    //   return "ft-cell--content__normal";
    // } else if (activeRow && readonly) {
    //   return "ft-cell--content__active-readonly";
    // }

    if (activeRow && readonly) {
      return "ft-cell--content__active-readonly";
    } else if (activeRow && mandatory && valid) {
      return "ft-cell--content__normal";
    } else if (!valid && mandatory) {
      return "ft-cell--content__notvalid-mandatory";
      // background: "#fef0ef",
    } else if (!valid) {
      return "ft-cell--content__notvalid";
    } else {
      return "ft-cell--content__normal";
    }
  },
  selectHeight: type => {
    return config.cell.type[type].height;
  },
  handleDirection: direction => {
    if (direction === "up") {
      return { borderTopStyle: "hidden" };
    } else {
      return { borderBottomStyle: "hidden" };
    }
  }
};
