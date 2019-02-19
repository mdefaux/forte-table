import React, { Component } from 'react';
import ForteTable from '../../src';
import NavMenu from './components/NavMenu/NavMenu';
import './css/App.css';

// Importing examples pages
import LettersXNumbers from './pages/LettersXNumbers';
import StandardExample from './pages/StandardExample';

const defaultPage = {
  pageName: 'Standard Example',
  pageNum: 0,
};

function ExampleContainer(props) {
  return <div>{props.link}</div>;
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: <StandardExample />,
      pageName: defaultPage.pageName,
      pageNum: defaultPage.pageNum,
    };

    this.updatePage = this.updatePage.bind(this);
  }

  updatePage(page) {
    this.setState({
      page: page.li.component,
      pageName: page.li.name,
      pageNum: page.index,
    });
  }

  render() {
    return (
      <div className='App'>
        <NavMenu
          links={[
            {
              name: 'Standard example',
              component: <StandardExample />,
            },
            {
              name: 'Letters and Numbers',
              component: <LettersXNumbers />,
            },
          ]}
          activePage={this.state.pageNum}
          updatePage={this.updatePage}
        />
        <h3>{this.state.pageName}</h3>
        <ExampleContainer link={this.state.page} />
      </div>
    );
  }
}

export default App;
