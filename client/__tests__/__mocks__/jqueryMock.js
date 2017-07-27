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
// mock get element by id
document.getElementById = (event) => ({
  disabled: true,
  textContent: 'test',
  text: 'test',
  style : {
    color: 'red'
  }
});
