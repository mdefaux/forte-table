import React from 'react';
import ForteTable from '../../../src/';

import '../resources/api-example.css';

const URL = 'https://api.punkapi.com/v2/beers?page=2&per_page=80';
const LOADER =
  'https://freeiconshop.com/wp-content/uploads/edd/beer-outline-filled.png';

export default class APIExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      test: 'test',
      data: null,
    };

    this.getData = this.getData.bind(this);
    this.renderCell = this.renderCell.bind(this);
  }

  /**
   * When the component mounts, fetch the data with getData()
   * and set the state.
   */
  componentDidMount() {
    this.getData(URL);
  }

  /**
   * Fetch data from a given URL
   * @param {String} url The API url to fetch data
   */
  getData(url) {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        // Set a timeout to simulate a slow request
        setTimeout(() => {
          this.setState({ data: data });
        }, 1500);
      });
  }

  renderCell(c, r) {
    // Render an image if the columns is 'image_url'
    if (c === 'image_url') {
      return <img style={{ width: '50px' }} src={r[c]} />;
    }
    // Render a list of ingredients if the column is 'ingredients'
    else if (c === 'ingredients') {
      let ingredients = r[c]['malt'].map((ingredient, i) => {
        return <li key={i}>{ingredient.name}</li>;
      });

      return <ul>{ingredients}</ul>;
    }
    // Render the content of the cell as default case
    return r[c];
  }

  render() {
    return (
      <div>
        <h3 style={{ textAlign: 'left' }}>Fetch a list of beers from an API</h3>
        <div>
          {!this.state.data && <img className='rotating-beer' src={LOADER} />}
        </div>
        <div>
          {this.state.data && (
            <ForteTable
              rows={() => this.state.data}
              columns={() => [
                'id',
                'name',
                'tagline',
                'image_url',
                'ingredients',
              ]}
              cellRender={this.renderCell}
              // defaultColumnWidth='auto'
              headRowRender={() => (
                // Return an empty span to remove the active row selection
                <span />
              )}
            />
          )}
        </div>
      </div>
    );
  }
}
