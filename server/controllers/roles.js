import { sendError, sendData } from './helpers/utilities';
import model from '../models/index';
const Role = model.role;
const User = model.user;

module.exports = {
   /**
   * - get a list of roles
   * @param {*} req - client request
   * @param {*} res - server response
   * @return {null} -
   */
  getRoles(req, res) {
    let hint;
    // check it limit and offset where passed
    if (req.query.offset && req.query.limit) {
      hint = { offset: req.query.offset, limit: req.query.limit };
    }

    // get all users
    Role.findAll({
      attributes: ['id', 'title', 'description'],
      order: [['title', 'ASC']],
      ...hint
    })
    .then(roles => sendData(res, roles, 200))
    .catch(error => sendError(res, error.message, 500));
  },
  /**
   * - create Role
   * @param {*} req - client request
   * @param {*} res - server response
   * @return {null} -
   */
  createRole(req, res) {
    // create object from request
    const role = req.body;

    // check for required fields
    if (role.title) {
      Role.create(role)
      .then(newRole => sendData(res, newRole, 201))
      .catch(err => sendError(res, err.message, 500));
    } else {
      sendError(res, 'Role title is compulsory.', 500);
    }
  },
  /**
   * - get role by id
   * @param {*} req - client request
   * @param {*} res - server response
   * @return {null} -
   */
  getRole(req, res) {
    // get user with this id
    Role.findOne({
      where: { id: req.params.id }
    })
    .then((role) => {
      if (!role) {
        return sendError(res, 'Role not found.', 200);
      }
      return sendData(res, role, 200);
    })
    .catch(error => sendError(res, error.message, 400));
  },
  /**
   * - update role with id
   * @param {*} req - client request
   * @param {*} res - server response
   * @return {null} -
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
        return sendError(res, 'Role not found.', 200);
      }
      return role
      .update({ ...changes })
      .then(() => sendData(res, role, 200))
      .catch(error => sendError(res, error.message, 400));
    })
    .catch(error => sendError(res, error.message, 400));
  },
  /**
   * - delete role with id
   * @param {*} req - client request
   * @param {*} res - server response
   * @return {null} -
   */
  deleteRole(req, res) {
    // get document with this id
    Role.findOne({
      where: { id: req.params.id }
    })
    .then((role) => {
      if (!role) {
        return sendError(res, 'Role not found.', 200);
      }

      return role
      .destroy()
      .then(() => sendData(res, role, 200))
      .catch(error => sendError(res, error.message, 400));
    })
    .catch(error => sendError(res, error.message, 400));
  },
   /**
   * - get user in a  role with id
   * @param {*} req - client request
   * @param {*} res - server response
   * @return {null} -
   */
  getUsers(req, res) {
    // get role with this id
    Role.findOne({
      where: { id: req.params.id }
    })
    .then((role) => {
      if (!role) {
        return sendError(res, 'Role not found.', 200);
      }
      // return user's documents
      return User.findAll({
        where: { roleId: req.params.id },
      })
      .then((users) => {
        if (!users) {
          return sendError(res, 'Users not found.', 200);
        }
        return sendData(res, users, 200);
      })
      .catch(error => sendError(res, error.message, 400));
    })
    .catch(error => sendError(res, error.message, 400));
  }
};

