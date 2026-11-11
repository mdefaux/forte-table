import React, { useState } from 'react';
import NavMenu from './components/NavMenu/NavMenu';
import './css/App.css';

import DataGridExample from './pages/DataGridExample';
import StandardExample from './pages/StandardExample';
import LettersXNumbers from './pages/LettersXNumbers';
import APIExample from './pages/APIExample';

const pages = [
  { name: 'Data grid (1000 records)', component: <DataGridExample /> },
  { name: 'Standard example', component: <StandardExample /> },
  { name: 'Letters and Numbers', component: <LettersXNumbers /> },
  { name: 'API Example', component: <APIExample /> },
];

export default function App() {
  const [pageNum, setPageNum] = useState(0);
  const page = pages[pageNum];

  return (
    <div className='App'>
      <NavMenu
        links={pages}
        activePage={pageNum}
        updatePage={({ index }) => setPageNum(index)}
      />
      <h3>{page.name}</h3>
      <div style={{ margin: '20px' }}>{page.component}</div>
    </div>
  );
}
