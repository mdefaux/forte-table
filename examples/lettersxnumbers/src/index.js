import React from "react";
import { render } from "react-dom";
import Table from "./Base";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

const App = () => (
  <div style={styles}>
    <h2>
      {"\u2728"} Forte Table {"\u2728"}
    </h2>
    <Table name="Base example" />
  </div>
);

render(<App />, document.getElementById("root"));
