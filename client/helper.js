// import tinymce from 'tinymce';

/**
 * redirect anonymous users
 */
export const requireAuth = () => {
  if (localStorage.getItem('jwt')) {
    window.location = '/#/signup';
  }
};

/**
 * check if logged in user is an admin
 */
export const isAdmin = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  return (user.role === 3);
};
export const toServertime = (time =>
 new Date(time).toDateString()
);


// export const initiateEditor = (target =>
//   tinymce.init({
//     selector: target,
//     height: 300,
//     browser_spellcheck: true,
//   })
// );
