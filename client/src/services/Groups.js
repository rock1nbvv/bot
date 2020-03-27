import axios from 'axios';

export default class GroupsAPI {
  static createGroup = data => axios.post('/api/groups', data).then(value => value.data);
  static getAllGroups = () => axios.get('/api/groups').then(value => value.data);
}
