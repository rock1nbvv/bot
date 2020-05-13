import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import HomePage from '../HomePage/HomePage';
import NotFound from '../NotFound/NotFound';
import PrivateRouteAdmin from './PrivateRouteAdmin';
import AdminPanel from '../AdminPanel/AdminPanel';
import Schedule from '../Schedule/Schedule';
import PersonalInformation from '../PersonalInformation/PersonalInformation';
import ListUser from '../ListUser/ListUser';
import ListGroup from '../ListGroup/ListGroup';
import ListEvent from '../ListEvent/ListEvent';
import PrivateRouteUser from './PrivateRouteUser';

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/schedule" component={Schedule} />
        <PrivateRouteUser exact path="/personal" component={PersonalInformation} />
        <PrivateRouteAdmin exact path="/admin" component={AdminPanel} />
        <PrivateRouteAdmin exact path="/listgroup" component={ListGroup} />
        <PrivateRouteAdmin exact path="/listuser" component={ListUser} />
        <PrivateRouteAdmin exact path="/listevent" component={ListEvent} />
        <Route component={NotFound} />
      </Switch>
    );
  }
}

export default Routes;
