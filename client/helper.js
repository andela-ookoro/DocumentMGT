
export const requireAuth = () => {
  console.log('came here');
  if (localStorage.getItem('jwt')) {
    console.log(' window.location = /#/signup');
    window.location = '/#/signup';
  }
}; 