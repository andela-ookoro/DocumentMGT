// import tinymce from 'tinymce';

export const requireAuth = () => {
  if (localStorage.getItem('jwt')) {
    window.location = '/#/signup';
  }
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
