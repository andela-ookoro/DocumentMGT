const Role = require('../models').role;
import Utility from './helpers/utilities';
 
  module.exports = {
   /**
   * - get a list of roles
   * @param {*} req - client request
   * @param {*} res - server response
   */
  getRoles(req, res) {
     let hint;
    // check it limit and offset where passed
    if (req.query.offset && req.query.limit ) {
      hint = { offset: req.query.offset , limit: req.query.limit };
    }

    // get all users
    Role.findAll({
       order: [['title', 'ASC']],
       ...hint
    })
    .then(roles => Utility.sendData(res, roles, 200))
    .catch(error => sendError(res, error.message, 500));
  },
  /**
   * - create Role
   * @param {*} req - client request
   * @param {*} res - server response
   */
  createRole(req, res) {
    // create object from request
    const role = req.body;

    // check for required fields
    if (role.title) {
      Role.create(role)
      .then(newRole => {
        Utility.sendData(res, newRole, 201);
      })
      .catch(err => {
        Utility.sendError(res, err.message, 500);
      });
    } else {
      Utility.sendError(res, 'Role title is compulsory.', 500);
    }
  },
  /**
   * - get role by id
   * @param {*} req - client request
   * @param {*} res - server response
   */
  getRole(req, res) {},
  /**
   * - update role with id
   * @param {*} req - client request
   * @param {*} res - server response
   */
  updateRole(req, res) {},
  /**
   * - delete role with id
   * @param {*} req - client request
   * @param {*} res - server response
   */
  deleteRole(req, res) {},
   /**
   * - get user in a  role with id
   * @param {*} req - client request
   * @param {*} res - server response
   */
  getUsers(req, res) {}
}
  
  
