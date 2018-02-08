import config from "./config-styles";

export default {
  root: {
    display: "table-row",
    newRowColor: config.colors.blue.normal,
    position: "relative"
    // borderRight: "1px solid #dde1e3"
    // border: `${_config.cell.borderWidth} solid ${_config.cell.borderColor}`
  },
  validation: {
    green: config.colors.green.dark
  },
  activeRow: {
    position: "absolute",
    backgroundColor: config.colors.blue.normal,
    width: "3px"
  },
  selectHeight: type => {
    return config.cell.type[type].height;
  },
  selectBackgroundColor(hover, newRow, activeRow) {
    if (activeRow && !hover && !newRow) return "#f7f7f7";
    else if (!activeRow && hover && !newRow) return "#F5F5F5";
    else if ((hover && newRow) || (!hover && newRow))
      return config.colors.green.light;
    else if (!hover) return "";
  }
};
