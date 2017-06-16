const usersController = require('../controllers').User;
const documentsController = require('../controllers/').Document;
const accessRightController = require('../controllers/').AccessRight;
const rolesController = require('../controllers/').Role;

module.exports = (app) => {
  app.get('/users/:id/documents', documentsController.getUserDocument);
  app.get('/search/users', usersController.lookupUser);
  app.get('/search/documents', documentsController.searchByTitle);

  app.get('/users/login', usersController.login)
  app.post('/users/logout', usersController.logout);

  app.route('/users/:id')
  .get(usersController.getUser)
  .delete(usersController.deleteUser)
  .put(usersController.updateUser);

  app.route('/users')
  .get(usersController.getUsers)
  .post(usersController.createUser);

  app.route('/documents/:id')
  .get(documentsController.getDocument)
  .delete(documentsController.deleteDocument)
  .put(documentsController.updateDocument);

  app.route('/documents')
  .get(documentsController.getDocuments)
  .post(documentsController.createDocument);


app.all('*', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of nothingness.',
}));
  
};  