global.$ = () => ({
  tabs: () => null,
  val: () => null,
  css: () => null,
});

global.tinyMCE = {
  get: (content) => ({
    getContent: () => 'hello world , how are you'
  })
};

global.tinymce = {
  init: () => {},
  get: (content) => ({
    getContent: () => 'hello world , how are you',
    setContent: () => null
  })
}
// mock get element by id
document.getElementById = (event) => ({
  disabled: true,
  textContent: 'test',
  text: 'test',
  style : {
    color: 'red'
  }
});

// mock getElementsByName for document accessRight  
document.getElementsByName = (event) => ([
  {
    id: 'role',
    checked: false
  },
  {
    id: 'public',
    checked: false
  },
  {
    id: 'private',
    checked: false
  }
]);