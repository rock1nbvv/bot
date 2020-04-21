import UsersAPI from '../services/Users';
import * as USERS from '../config/Users';
import setDefaultOptions from '../utils/setDefaultOptions';
import * as NOTISTACK from '../config/Notistack';

export function loginInSystem(userData) {
  return dispatch => {
    dispatch({
      type: USERS.LOG_IN_API_REQUEST
    });

    UsersAPI.login(userData)
      .then(res => {
        const { token } = res;
        dispatch({
          type: USERS.LOG_IN_API_SUCCEEDED,
          payload: token
        });

        localStorage.setItem('Authorization', token);
        setDefaultOptions(token);

        UsersAPI.getInformationByJWT().then(res => {
          dispatch({
            type: USERS.LOG_IN_API_GET_TOKEN_SUCCEEDED,
            payload: res
          });
        });
      })
      .catch(() => {
        dispatch({
          type: USERS.LOG_IN_API_FAILED,
          payload: 'Fail to log in'
        });
        dispatch({
          type: NOTISTACK.ENQUEUE_SNACKBAR,
          notification: {
            ...{
              message: 'Fail to log in'
            }
          }
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
          type: USERS.LOG_IN_API_SUCCEEDED,
          payload: token
        });

        localStorage.setItem('Authorization', token);
        setDefaultOptions(token);
        UsersAPI.getInformationByJWT().then(res => {
          dispatch({
            type: USERS.LOG_IN_API_GET_TOKEN_SUCCEEDED,
            payload: res
          });
        });
      })
      .catch(() => {
        dispatch({
          type: USERS.LOG_IN_API_FAILED,
          payload: 'Fail to create user'
        });
        dispatch({
          type: NOTISTACK.ENQUEUE_SNACKBAR,
          notification: {
            ...{
              message: 'Fail to create user'
            }
          }
        });
      });
  };
}

export function createUserByTelegram(userData) {
  return dispatch => {
    dispatch({
      type: USERS.LOG_IN_API_REQUEST
    });
    UsersAPI.createUserByTelegram(userData)
      .then(res => {
        const { token } = res;
        dispatch({
          type: USERS.LOG_IN_API_SUCCEEDED,
          payload: token
        });
        localStorage.setItem('Authorization', token);
        setDefaultOptions(token);
        UsersAPI.getInformationByJWT().then(res => {
          dispatch({
            type: USERS.LOG_IN_API_GET_TOKEN_SUCCEEDED,
            payload: res
          });
        });
      })
      .catch(() => {
        dispatch({
          type: USERS.LOG_IN_API_FAILED,
          payload: 'Fail to register use telegram'
        });
        dispatch({
          type: NOTISTACK.ENQUEUE_SNACKBAR,
          notification: {
            ...{
              message: 'Fail to register use telegram'
            }
          }
        });
      });
  };
}

export function connectUserToTelegram(userData) {
  return dispatch => {
    dispatch({
      type: USERS.CONNECT_TELEGRAM_IN_API_REQUEST
    });
    UsersAPI.connectUserToTelegram(userData)
      .then(res => {
        const { token } = res;
        dispatch({
          type: USERS.CONNECT_TELEGRAM_IN_API_SUCCEEDED,
          payload: token
        });
        localStorage.setItem('Authorization', token);
        setDefaultOptions(token);
        UsersAPI.getInformationByJWT().then(res => {
          dispatch({
            type: USERS.CONNECT_TELEGRAM_IN_API_GET_TOKEN_SUCCEEDED,
            payload: res
          });
          dispatch({
            type: NOTISTACK.ENQUEUE_SNACKBAR,
            notification: {
              ...{
                message: 'Success to connect user ti telegram'
              }
            }
          });
        });
      })
      .catch(() => {
        dispatch({
          type: USERS.CONNECT_TELEGRAM_IN_API_FAILED,
          payload: 'Fail to connect telegram to user'
        });
        dispatch({
          type: NOTISTACK.ENQUEUE_SNACKBAR,
          notification: {
            ...{
              message: 'Fail to connect telegram to user'
            }
          }
        });
      });
  };
}

export function disconnectUserToTelegram(userData) {
  return dispatch => {
    dispatch({
      type: USERS.DISCONNECT_TELEGRAM_IN_API_REQUEST
    });
    UsersAPI.disconnectUserToTelegram(userData)
      .then(res => {
        const { token } = res;
        dispatch({
          type: USERS.DISCONNECT_TELEGRAM_IN_API_SUCCEEDED,
          payload: token
        });
        localStorage.setItem('Authorization', token);
        setDefaultOptions(token);
        UsersAPI.getInformationByJWT().then(res => {
          dispatch({
            type: USERS.DISCONNECT_TELEGRAM_IN_API_GET_TOKEN_SUCCEEDED,
            payload: res
          });
          dispatch({
            type: NOTISTACK.ENQUEUE_SNACKBAR,
            notification: {
              ...{
                message: 'Success to disconnect user ti telegram'
              }
            }
          });
        });
      })
      .catch(() => {
        dispatch({
          type: USERS.DISCONNECT_TELEGRAM_IN_API_FAILED,
          payload: 'Fail to disconnect telegram to user'
        });
        dispatch({
          type: NOTISTACK.ENQUEUE_SNACKBAR,
          notification: {
            ...{
              message: 'Fail to disconnect telegram to user'
            }
          }
        });
      });
  };
}

export function editPersonalData(userDate) {
  return dispatch => {
    dispatch({
      type: USERS.EDIT_USER_DATE_IN_API_REQUEST
    });

    UsersAPI.editUser(userDate)
      .then(res => {
        const { token } = res;
        dispatch({
          type: USERS.EDIT_USER_DATE_IN_API_SUCCEEDED,
          payload: token
        });
        localStorage.setItem('Authorization', token);
        setDefaultOptions(token);
        dispatch({
          type: NOTISTACK.ENQUEUE_SNACKBAR,
          notification: {
            ...{
              message: 'Success edit'
            }
          }
        });
        UsersAPI.getInformationByJWT().then(res => {
          dispatch({
            type: USERS.EDIT_USER_DATE_IN_API_GET_TOKEN_SUCCEEDED,
            payload: res
          });
        });
      })
      .catch(() => {
        dispatch({
          type: USERS.EDIT_USER_DATE_IN_API_FAILED,
          payload: 'fail to edit data'
        });
        dispatch({
          type: NOTISTACK.ENQUEUE_SNACKBAR,
          notification: {
            ...{
              message: 'Fail to edit data'
            }
          }
        });
      });
  };
}

export function logInUseOldJWT(JWT) {
  return dispatch => {
    setDefaultOptions(JWT);
    UsersAPI.getInformationByJWT()
      .then(res => {
        dispatch({
          type: USERS.LOG_IN_API_GET_TOKEN_SUCCEEDED,
          payload: res
        });
      })
      .catch(() => {
        setDefaultOptions();
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
