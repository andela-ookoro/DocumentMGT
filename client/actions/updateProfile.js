import axios from 'axios';
import sendMessage from './message';



const updateProfile = credentials =>
  axios.put(`/api/v1/users/${credentials.userid}`, credentials)
  .then((response) => {
    // if jwt was returned
    if (response.data.jwtToken) {
      localStorage.setItem('jwt', JSON.stringify(response.data.jwtToken));
      localStorage.setItem('userInfo', JSON.stringify(response.data.userInfo));
      // reload the page to recieve new values from local storage
      location.reload();
      return sendMessage('profile', 'Profile has been successfully updated');
    }
    return sendMessage('profile',
    'Unable to update your profile, please try again');
  })
  .catch((error) => {
    if (error.response) {
      return sendMessage('profile', error.response.data.message);
    }
  });

export default updateProfile;
