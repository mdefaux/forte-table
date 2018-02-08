/**
 * Main configuration variables for global CSS rules.
 *  - main: rules valid for the whole document
 *  - cell: rules valid for all the document cell
 */

export default {
  container: {
    margin: "20px",
    overflow: "auto"
  },
  main: {
    fontFamily: "Lato, 'Helvetica Neue'",
    fontSize: "13px",
    padding: "6px"
  },
  cell: {
    padding: "0 6px",
    width: 150,
    height: 30,
    borderWidth: "1px",
    borderColor: "#e9e9e9",
    cellHeaderColor: "#f7f7f7",
    type: {
      small: {
        height: 30
      },
      medium: {
        height: 40
      },
      large: {
        height: 50
      }
    }
  },
  colors: {
    blue: {
      normal: "#1E88E5",
      dark: "#0D47A1",
      text: "white"
    },
    blueGray: {
      light: "#ECEFF1",
      normal: "#546E7A",
      dark: "#263238",
      text: "white"
    },
    purple: {
      normal: "#AA00FF",
      dark: "#6A1B9A",
      text: "white"
    },
    red: {
      light: "#fef0ef",
      normal: "#f04134",
      dark: "#bd2636",
      text: "white"
    },
    green: {
      light: "#E8F5E9",
      normal: "#00C853",
      dark: "#007b43",
      text: "black"
    },
    gray: {
      light: "#f7f7f7"
    }
  }
};
