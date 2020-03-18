import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class HomePage extends Component {
  render() {
    return (
      <div>
        <p>HomePage</p>
        <Link to={'/auth'}>create user</Link>
      </div>
    );
  }
}

export default HomePage;
