import React from 'react';
import './nav-menu.css';

const NavMenu = props => (
  <header className='App-header'>
    <h1 className='App-title'>
      {'\u2728'} Forte Table {'\u2728'}
    </h1>
    <ul className='ft-examples--menu'>
      {props.links.map((li, index) => {
        return (
          <li
            className={
              props.activePage === index ? 'ft-examples--menu__active' : ''
            }
            key={index}
            onClick={() => props.updatePage({ li, index })}
          >
            <a>{li.name}</a>
          </li>
        );
      })}
    </ul>
  </header>
);

export default NavMenu;
