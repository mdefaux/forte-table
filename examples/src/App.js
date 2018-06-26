import React, { Component } from 'react';
import ForteTable from '../../src';
import './App.css';

const App = () => (
  <div className="App">
    <header className="App-header">
      <h1 className="App-title"> {"\u2728"} Forte Table {"\u2728"}</h1>
    </header>
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
  </div>
)

export default App;