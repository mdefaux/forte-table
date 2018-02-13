import React from "react";
import { ForteTable } from "forte-table";

export default ({ name }) => (
  <ForteTable
    rows={() => [1, 2, 3]}
    columns={() => ["a", "b", "c"]}
    cellRender={(c, r) => {
      return "cell" + c + r;
    }}
    onCellClick={(e, c, r) => {
      alert("buuu:" + c + r);
    }}
  />
);
