import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import HomePage from '../HomePage/HomePage';
import NotFound from '../NotFound/NotFound';
import PrivateRoute from './PrivateRoute';
import AdminPanel from '../AdminPanel/AdminPanel';
import Schedule from '../Schedule/Schedule';
import PersonalInformation from '../PersonalInformation/PersonalInformation';
import NewEvent from '../NewEvent/NewEvent';
import CreateGroup from '../CreateGroup/CreateGroup';
import ListUser from '../ListUser/ListUser';

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/schedule" component={Schedule} />
        <Route exact path="/personal" component={PersonalInformation} />
        <PrivateRoute exact path="/admin" component={AdminPanel} />
        <PrivateRoute exact path="/newevent" component={NewEvent} />
        <PrivateRoute exact path="/newgroup" component={CreateGroup} />
        <PrivateRoute exact path="/listuser" component={ListUser} />
        <Route component={NotFound} />
      </Switch>
    );
  }
}

export default Routes;
