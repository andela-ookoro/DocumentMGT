'use strict';

var _controllers = require('../controllers');

var _controllers2 = _interopRequireDefault(_controllers);

var _utilities = require('../controllers/helpers/utilities');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import the model
var usersController = _controllers2.default.User;
var documentsController = _controllers2.default.Document;
var rolesController = _controllers2.default.Role;
module.exports = function (app) {
  // unathenticated routes
  app.post('/users/login', usersController.login);
  app.post('/users/logout', usersController.logout);
  app.post('/users', usersController.createUser);
  app.get('/roles', rolesController.getRoles);
  // check for user session
  app.use(_utilities.validateUser);

  // the routes below are authenticated
  app.get('/users/:id/documents', _utilities.adminOnly, usersController.getUserDocument);
  app.get('/search/users', _utilities.adminOnly, usersController.lookupUser);
  app.get('/search/documents', documentsController.searchByTitle);

  app.route('/users/:id').get(usersController.getUser).delete(usersController.blockUser).put(usersController.updateUser);

  app.post('/users/restore/:id', _utilities.adminOnly, usersController.restoreUser);
  app.get('/users', _utilities.adminOnly, usersController.getUsers);

  app.route('/documents/:id').get(documentsController.getDocument).delete(documentsController.deleteDocument).put(documentsController.updateDocument);

  app.route('/documents').get(_utilities.adminOnly, documentsController.getDocuments).post(documentsController.createDocument);

  app.post('/roles', _utilities.adminOnly, rolesController.createRole);

  app.route('/roles/:id').get(_utilities.adminOnly, rolesController.getRole).put(_utilities.adminOnly, rolesController.updateRole).delete(_utilities.adminOnly, rolesController.deleteRole);

  app.get('/roles/:id/users', _utilities.adminOnly, rolesController.getUsers);
};