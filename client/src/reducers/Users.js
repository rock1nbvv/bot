import * as USERS from '../config/Users';

const initialState = {
  loading: true,
  openWindowLogIn: false,
  isAuthorization: false,
  jwt: '',
  error: '',
  personalInfo: {
    _id: '',
    isAdmin: false,
    login: '',
    firstName: '',
    lastName: '',
    middleName: '',
    telegramId: ''
  }
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  // eslint-disable-next-line
    switch (type) {
    case USERS.LOG_IN_API_REQUEST:
    case USERS.EDIT_USER_DATE_IN_API_REQUEST:
    case USERS.CONNECT_TELEGRAM_IN_API_REQUEST:
    case USERS.DISCONNECT_TELEGRAM_IN_API_REQUEST:
      return {
        ...state,
        loading: false,
        error: ''
      };
    case USERS.LOG_IN_API_SUCCEEDED:
    case USERS.EDIT_USER_DATE_IN_API_SUCCEEDED:
    case USERS.CONNECT_TELEGRAM_IN_API_SUCCEEDED:
    case USERS.DISCONNECT_TELEGRAM_IN_API_SUCCEEDED:
      return {
        ...state,
        loading: true,
        jwt: payload,
        error: ''
      };
    case USERS.LOG_IN_API_FAILED:
      return {
        ...initialState,
        loading: true,
        openWindowLogIn: true,
        error: payload
      };
    case USERS.EDIT_USER_DATE_IN_API_FAILED:
    case USERS.CONNECT_TELEGRAM_IN_API_FAILED:
    case USERS.DISCONNECT_TELEGRAM_IN_API_FAILED:
      return {
        ...initialState,
        loading: true,
        error: payload
      };
    case USERS.LOG_IN_API_GET_TOKEN_SUCCEEDED:
    case USERS.EDIT_USER_DATE_IN_API_GET_TOKEN_SUCCEEDED:
    case USERS.CONNECT_TELEGRAM_IN_API_GET_TOKEN_SUCCEEDED:
    case USERS.DISCONNECT_TELEGRAM_IN_API_GET_TOKEN_SUCCEEDED:
      return {
        ...state,
        openWindowLogIn: false,
        isAuthorization: true,
        personalInfo: { ...payload }
      };
    case USERS.OPEN_WINDOW_AUTH:
      return {
        ...state,
        openWindowLogIn: true
      };
    case USERS.CLOSE_WINDOW_AUTH:
      return {
        ...state,
        openWindowLogIn: false
      };
    case USERS.LOG_OUT:
      return initialState;
    default:
      return state;
  }
}
