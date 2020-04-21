import axios from 'axios';

export default class UsersAPI {
  static createUser = userData => axios.post('/api/user', userData).then(value => value.data);
  static createUserByTelegram = userData =>
    axios.post('/api/user/telegram', userData).then(value => value.data);
  static login = logInAndPassword =>
    axios.post('/api/user/login', logInAndPassword).then(value => value.data);
  static getInformationByJWT = () => axios.get('/api/user').then(value => value.data);
  static getAllUserForAdmin = data => {
    const { page = 1, limit = 9 } = data;
    return axios
      .get('/api/user/all', {
        params: { page, limit }
      })
      .then(value => value.data);
  };
  static setAdminStatus = data => axios.post('/api/user/setstatus', data).then(value => value.data);
}
