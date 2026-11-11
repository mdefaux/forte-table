import React, { useEffect, useState } from 'react';
import ForteTable from '../../../src';

import '../resources/api-example.css';

const URL = 'https://api.punkapi.com/v2/beers?page=2&per_page=80';
const LOADER =
  'https://freeiconshop.com/wp-content/uploads/edd/beer-outline-filled.png';

function renderCell(c, r) {
  if (c === 'image_url') {
    return <img style={{ width: '50px' }} src={r[c]} alt={r.name} />;
  }
  if (c === 'ingredients') {
    return (
      <ul>
        {r[c].malt.map((ingredient, i) => (
          <li key={i}>{ingredient.name}</li>
        ))}
      </ul>
    );
  }
  return r[c];
}

export default function APIExample() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(URL, { signal: controller.signal })
      .then(response => response.json())
      .then(setData)
      .catch(e => e.name !== 'AbortError' && setError(e.message));
    return () => controller.abort();
  }, []);

  return (
    <div>
      <h3 style={{ textAlign: 'left' }}>Fetch a list of beers from an API</h3>
      {error && <div>Error: {error}</div>}
      {!data && !error && (
        <img className='rotating-beer' src={LOADER} alt='loading' />
      )}
      {data && (
        <ForteTable
          rows={() => data}
          columns={() => ['id', 'name', 'tagline', 'image_url', 'ingredients']}
          cellRender={renderCell}
          defaultColumnWidth='auto'
          headRowRender={() => <span />}
        />
      )}
    </div>
  );
}
