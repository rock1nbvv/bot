import * as GROUPS from '../config/Groups';

const initialState = {
  load: false,
  groups: [],
  status: ''
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  // eslint-disable-next-line
    switch (type) {
    case GROUPS.REQUEST_CREATE_GROUP:
    case GROUPS.REQUEST_GET_ALL_GROUPS:
      return {
        ...state,
        load: true
      };
    case GROUPS.SUCCESS_ALL_GROUPS:
      return {
        ...state,
        load: false,
        groups: payload
      };
    case GROUPS.SUCCESS_CREATE_GROUP:
      return {
        ...state,
        load: false,
        status: payload
      };
    case GROUPS.ERROR_ALL_GROUPS:
    case GROUPS.ERROR_CREATE_GROUP:
      return {
        load: false,
        status: payload
      };
    default:
      return state;
  }
}
