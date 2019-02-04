import React from 'react';
import ForteTable from '../../../src';

function StandardExample() {
  let data = [
    {
      id: 1,
      first_name: 'Floyd',
      last_name: 'Ruusa',
      email: 'fruusa0@php.net',
      gender: 'Male',
      ip_address: '17.133.167.13',
    },
    {
      id: 2,
      first_name: 'Floris',
      last_name: 'Delaney',
      email: 'fdelaney1@arizona.edu',
      gender: 'Female',
      ip_address: '233.200.180.188',
    },
  ];

  return (
    <ForteTable
      rows={() => [0, 1]}
      columns={() => ['id', 'first_name', 'last_name', 'email', 'ip_address']}
      cellRender={(c, r) => {
        return data[r][c];
      }}
      onCellClick={(e, c, r) => {
        let title = data[r].gender === 'Male' ? 'Mr.' : 'Ms.';
        let text = `${title} ${data[r].last_name} has ${c} = '${data[r][c]}'.`;
        alert(text);
      }}
    />
  );
}

export default StandardExample;
