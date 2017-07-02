import axios from 'axios';

class SessionApi {
   /**
   * - authenticate user
   * @param {*} credentials - user credential - email and password
   */
  static login(credentials) {
    return axios.get('/users/login',
      { ...credentials })
    .then(response => {
      return response.json();
    })
    .catch(error => error );
  } 
}

export default SessionApi;

