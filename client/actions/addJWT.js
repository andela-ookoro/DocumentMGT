import axios from 'axios';
const addJWT = ()  => {
  let  token = JSON.parse(localStorage.getItem('jwt'));
  if (token) {
      axios.defaults.headers.common['Authorization'] = token;
  } else {
      axios.defaults.headers.common['Authorization'] = null;    
      delete axios.defaults.headers.common['Authorization'];
  }
};
export default addJWT;