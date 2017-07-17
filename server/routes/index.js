import Controllers from '../controllers';
import { validateUser, adminOnly } from '../controllers/helpers/utilities';



// import the model
const usersController = Controllers.User;
const documentsController = Controllers.Document;
const rolesController = Controllers.Role;
module.exports = (app) => {
  // unathenticated routes
  app.post('/users/login', usersController.login);
  app.post('/users/logout', usersController.logout);
  app.post('/users', usersController.createUser);
  app.get('/roles', rolesController.getRoles);
  // check for user session
  app.use(validateUser);

  // the routes below are authenticated
  app.get('/users/:id/documents', adminOnly, usersController.getUserDocument);
  app.get('/search/users', adminOnly, usersController.lookupUser);
  app.get('/search/documents', documentsController.searchByTitle);

  app.route('/users/:id')
  .get(usersController.getUser)
  .delete(usersController.blockUser)
  .put(usersController.updateUser);

  app.post('/users/restore/:id', adminOnly, usersController.restoreUser);
  app.get('/users', adminOnly, usersController.getUsers);

  app.route('/documents/:id')
  .get(documentsController.getDocument)
  .delete(documentsController.deleteDocument)
  .put(documentsController.updateDocument);

  app.route('/documents')
  .get(adminOnly, documentsController.getDocuments)
  .post(documentsController.createDocument);

  app.post('/roles', adminOnly, rolesController.createRole);

  app.route('/roles/:id')
  .get(adminOnly, rolesController.getRole)
  .put(adminOnly, rolesController.updateRole)
  .delete(adminOnly, rolesController.deleteRole);

  app.get('/roles/:id/users', adminOnly, rolesController.getUsers);
};
