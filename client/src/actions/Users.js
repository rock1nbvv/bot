import UsersAPI from '../services/Users';
import * as USERS from '../config/Users';
import setDefaultOptions from '../utils/setDefaultOptions';

export function loginInSystem(userData) {
  return dispatch => {
    dispatch({
      type: USERS.LOG_IN_API_REQUEST
    });

    UsersAPI.login(userData)
      .then(res => {
        const { token } = res;
        dispatch({
          type: USERS.LOG_IN_API_GET_TOKEN_SUCCEEDED,
          payload: token
        });

        localStorage.setItem('Authorization', token);
        setDefaultOptions(token);
      })
      .catch(() => {
        dispatch({
          type: USERS.LOG_IN_API_FAILED
        });
      });
  };
}

export function createUser(userData) {
  return dispatch => {
    dispatch({
      type: USERS.LOG_IN_API_REQUEST
    });

    UsersAPI.createUser(userData)
      .then(res => {
        const { token } = res;
        dispatch({
          type: USERS.LOG_IN_API_GET_TOKEN_SUCCEEDED,
          payload: token
        });

        localStorage.setItem('Authorization', token);
        setDefaultOptions(token);
      })
      .catch(() => {
        dispatch({
          type: USERS.LOG_IN_API_FAILED
        });
      });
  };
}

export function openWindowAuth() {
  return dispatch => {
    dispatch({
      type: USERS.OPEN_WINDOW_AUTH
    });
  };
}

export function closeWindowAuth() {
  return dispatch => {
    dispatch({
      type: USERS.CLOSE_WINDOW_AUTH
    });
  };
}

export function resetError() {
  return dispatch => {
    dispatch({
      type: USERS.RESET_ERROR
    });
  };
}

export function signOut() {
  return dispatch => {
    localStorage.removeItem('Authorization');
    dispatch({
      type: USERS.LOG_OUT
    });
    setDefaultOptions();
  };
}
