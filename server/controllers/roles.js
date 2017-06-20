import model from '../models/index';
const Role = model.role;
const User = model.user;
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
    if (req.query.offset && req.query.limit) {
      hint = { offset: req.query.offset, limit: req.query.limit };
    }

    // get all users
    Role.findAll({
      order: [['title', 'ASC']],
      ...hint
    })
    .then(roles => Utility.sendData(res, roles, 200))
    .catch(error => Utility.sendError(res, error.message, 500));
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
      .then(newRole => Utility.sendData(res, newRole, 201))
      .catch(err => Utility.sendError(res, err.message, 500));
    } else {
      Utility.sendError(res, 'Role title is compulsory.', 500);
    }
  },
  /**
   * - get role by id
   * @param {*} req - client request
   * @param {*} res - server response
   */
  getRole(req, res) {
    // get user with this id
    Role.findOne({
      where: { id: req.params.id }
    })
    .then((role) => {
      if (!role) {
        return Utility.sendError(res, 'Role not found.', 200);
      }
      return Utility.sendData(res, role, 200);
    })
    .catch(error => Utility.sendError(res, error.message, 400));
  },
  /**
   * - update role with id
   * @param {*} req - client request
   * @param {*} res - server response
   */
  updateRole(req, res) {
    // get new user info
    const changes = req.body;
    // get user with this id
    Role.findOne({
      where: { id: req.params.id }
    })
    .then((role) => {
      if (!role) {
        return Utility.sendError(res, 'Role not found.', 200);
      }
      return role
      .update({ ...changes })
      .then(() => Utility.sendData(res, role, 200))
      .catch(error => Utility.sendError(res, error.message, 400));
    })
    .catch(error => Utility.sendError(res, error.message, 400));
  },
  /**
   * - delete role with id
   * @param {*} req - client request
   * @param {*} res - server response
   */
  deleteRole(req, res) {
    // get document with this id
    Role.findOne({
      where: { id: req.params.id }
    })
    .then((role) => {
      if (!role) {
        return Utility.sendError(res, 'Role not found.', 200);
      }

      return role
      .destroy()
      .then(() => Utility.sendData(res, role, 200))
      .catch(error => Utility.sendError(res, error.message, 400));
    })
    .catch(error => Utility.sendError(res, error.message, 400));
  },
   /**
   * - get user in a  role with id
   * @param {*} req - client request
   * @param {*} res - server response
   */
  getUsers(req, res) {
    // get role with this id
    Role.findOne({
      where: { id: req.params.id }
    })
    .then((role) => {
      if (!role) {
        return Utility.sendError(res, 'Role not found.', 200);
      }
      // return user's documents
      return User.findAll({
        where: { roleId: req.params.id },
      })
      .then((users) => {
        if (!users) {
          return Utility.sendError(res, 'Users not found.', 200);
        }
        return Utility.sendData(res, users, 200);
      })
      .catch(error => Utility.sendError(res, error.message, 400));
    })
    .catch(error => Utility.sendError(res, error.message, 400));
  }
};

