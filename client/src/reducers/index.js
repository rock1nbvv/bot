import { combineReducers } from 'redux';

import Users from './Users';
import Groups from './Groups';
import Notistack from './Notistack';

export default combineReducers({
  Users,
  Groups,
  Notistack
});
