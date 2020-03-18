import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import HomePage from '../HomePage/HomePage';
import NotFound from '../NotFound/NotFound';
import Auth from '../Auth/Auth';

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/auth" component={Auth} />
        <Route component={NotFound} />
      </Switch>
    );
  }
}

export default Routes;
