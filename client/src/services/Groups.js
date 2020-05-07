import axios from 'axios';

export default class GroupsAPI {
  static createGroup = data => axios.post('/api/groups', data).then(value => value.data);
  static getAllGroups = data => {
    const { page = 1, limit = 9 } = data;
    return axios
      .get('/api/groups/all', {
        params: { page, limit }
      })
      .then(value => value.data);
  };

  static editGroup(id, name) {
    return axios
      .put('/api/groups', {
        groupId: id,
        name
      })
      .then(value => value.data);
  }

  static deleteGroup(id) {
    return axios.delete('/api/groups', {
      params: {
        groupId: id
      }
    });
  }
}
