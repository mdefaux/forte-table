import React from 'react';
import ForteTable from '../../../src'; //
import data from '../../data/persons.json'; // loads data from file

function StandardExample() {
  return (
    <ForteTable
      rows={() => data} // sets the rows as the array of data
      columns={() => ['id', 'first_name', 'last_name', 'email', 'ip_address']} // sets the array of columns
      cellRender={(c, r) => {
        // renders the content of each cell
        return r[c]; // takes text of column c of the row r
      }}
      onCellDoubleClick={(e, c, r) => {
        // callback on double click over cell
        let title = r.gender === 'Male' ? 'Mr.' : 'Ms.'; // gets title form gender field of current row
        let text = `${title} ${r.last_name} has ${c} = '${r[c]}'.`; // composes text
        alert(text); // displays message.
      }}
    />
  );
}

export default StandardExample;
