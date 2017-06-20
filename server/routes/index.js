import Controllers from '../controllers';
import Utility from '../controllers/helpers/utilities';

// import the model
const usersController = Controllers.User;
const documentsController = Controllers.Document;
const accessRightController = Controllers.AccessRight;
const rolesController = Controllers.Role;
module.exports = (app, express, path, passport) => {
  // serve static files in public folder
  const publicPath = path.join(__dirname, '../../public/');
  app.use(express.static(publicPath));

  // unathenticated routes
  app.get('/users/login', usersController.login);
  app.post('/users/logout', usersController.logout);
  app.post('/users/', usersController.createUser);

  // check for user session
  // app.use(Utility.validateUser);

  // the routes below are authenticated
  app.get('/users/:id/documents', usersController.getUserDocument);
  app.get('/search/users', usersController.lookupUser);
  app.get('/search/documents', documentsController.searchByTitle);

  app.route('/users/:id')
  .get(usersController.getUser)
  .delete(usersController.deleteUser)
  .put(usersController.updateUser);

  app.get('/users', usersController.getUsers);

  app.route('/documents/:id')
  .get(documentsController.getDocument)
  .delete(documentsController.deleteDocument)
  .put(documentsController.updateDocument);

  app.route('/documents')
  .get(documentsController.getDocuments)
  .post(documentsController.createDocument);

  app.route('/roles')
  .get(rolesController.getRoles)
  .post(rolesController.createRole);

  app.route('/roles/:id')
  .get(rolesController.getRole)
  .put(rolesController.updateRole)
  .delete(rolesController.deleteRole);

  app.get('/roles/:id/users', rolesController.getUsers);

  app.all('/', (req, res) =>
  res.sendFile(`${publicPath}index.html`)
);
  app.all('/', (req, res) => res.status(404).send({
    message: 'Route was not found.'
  }));
};
