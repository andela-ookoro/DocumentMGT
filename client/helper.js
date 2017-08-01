// import tinymce from 'tinymce';

/**
 * redirect anonymous users
 * @returns {null} -
 */
export const requireAuth = () => {
  if (localStorage.getItem('jwt')) {
    window.location = '/#/signup';
  }
};

/**
 * check if logged in user is an admin
 * @returns {boolean} - status
 */
export const isAdmin = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  return (user.isAdmin);
};

export const toServertime = (time =>
 new Date(time).toDateString()
);

/**
 * @summary the time difference between a date and the current time
 * @param {date} date -
 * @returns {string} - the time since the date passed
 */
export const timeSince = (date) => {
  date = new Date(date);
  // convert timetstamp to second
  const seconds = Math.floor((new Date() - date) / 1000);
  // convert date to years
  let interval = Math.floor(seconds / 31536000);
  // check if date difference is up to a year
  if (interval >= 1) {
    return `${interval} year${(interval > 1) ? 's' : ''} ago`;
  }
  // check if date is up to a month
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return `${interval} month${(interval > 1) ? 's' : ''} ago`;
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return `${interval} day${(interval > 1) ? 's' : ''} ago`;
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return `${interval} hour${(interval > 1) ? 's' : ''} ago`;
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return `${interval} minute${(interval > 1) ? 's' : ''} ago`;
  }
  return `${Math.floor(seconds)} second${(interval > 1) ? 's' : ''} ago`;
};
