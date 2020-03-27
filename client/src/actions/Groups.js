import GroupsAPI from '../services/Groups';
import * as GROUPS from '../config/Groups';

export function createGroup(data) {
  return dispatch => {
    dispatch({
      type: GROUPS.REQUEST_CREATE_GROUP
    });

    GroupsAPI.createGroup(data)
      .then(res => {
        dispatch({
          type: GROUPS.SUCCESS_CREATE_GROUP,
          payload: res.message
        });
      })
      .catch(e => {
        dispatch({
          type: GROUPS.ERROR_CREATE_GROUP,
          payload: e.response.data.message
        });
      });
  };
}

export function getAllGroups() {
  return dispatch => {
    dispatch({
      type: GROUPS.REQUEST_GET_ALL_GROUPS
    });

    GroupsAPI.getAllGroups()
      .then(res => {
        dispatch({
          type: GROUPS.SUCCESS_ALL_GROUPS,
          payload: res
        });
      })
      .catch(e => {
        dispatch({
          type: GROUPS.ERROR_ALL_GROUPS,
          payload: e.response.data.message
        });
      });
  };
}
