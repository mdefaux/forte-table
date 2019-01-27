import React from 'react';
import ForteTable from '../../../src';

function StandardExample() {
  return (
    <ForteTable
      rows={() => [1, 2, 3, 4, 5, 6, 7, 8, 9]}
      columns={() => ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']}
      cellRender={(c, r) => {
        return 'cell' + c + r;
      }}
      onCellClick={(e, c, r) => {
        alert('buuu:' + c + r);
      }}
    />
  );
}

export default StandardExample;
