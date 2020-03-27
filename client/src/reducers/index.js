import { combineReducers } from 'redux';

import Users from './Users';
import Groups from './Groups';

export default combineReducers({
  Users,
  Groups
});
