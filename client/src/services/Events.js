import axios from 'axios';

export default class EventsAPI {
  static createScheduledEvent = data => axios.post('/api/event', data).then(value => value.data);

  static createEvent = data => axios.post('/api/event/sch', data).then(value => value.data);

  static getAllEvents = data => {
    const { page = 1, limit = 9 } = data;
    return axios
      .get('/api/event/all', {
        params: { page, limit }
      })
      .then(value => value.data);
  };

  static getAllEventsByGroup = data => {
    const { page = 1, limit = 9 } = data;
    return axios
      .get('/api/event/group', {
        params: { page, limit }
      })
      .then(value => value.data);
  };
}
