import bcrypt from 'bcrypt-nodejs';
import model from '../models/index';
import { sendError, returnJWt, sendData } from './helpers/utilities';

const User = model.user;
const Document = model.document;

module.exports = {
   /**
   * - login registered users
   * @param {*} req - client request
   * @param {*} res - server response
   * @return {object} - jwt
   */
  login(req, res) {
    // create object from request
    const user = req.body;
    // check for required fields
    if (user.email && user.password) {
      // get user with this email
      User
        .find({
          where: {
            email: user.email
          },
        })
        .then((foundUser) => {
          if (foundUser) {
            const userPassword = foundUser.password;
            // compare password
            const pass = bcrypt.compareSync(user.password, userPassword);
            if (pass) {
              return returnJWt(res, foundUser, 200);
            }
            return sendError(res, 'Wrong email or password.', 401);
          }
          return sendError(res, 'Wrong email or password.', 401);
        })
        .catch(err => sendError(res, err.message));
    } else {
      return sendError(res, 'Email and password are compulsory.',
      500);
    }
  },
   /**
   * - logout user
   * @param {*} req - client request
   * @param {*} res - server response
   * @return {object} - redirect
   */
  logout(req, res) {
    req.logout();
    res.redirect('/');
  },
  /**
   * - get a list of registered users
   * @param {*} req - client requesit
   * @param {*} res - server response
   * @return {object} - users
   */
  getUsers(req, res) {
    // check it limit and offset where passed
    const offset = parseInt(req.query.offset, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 7;
    const hint = { offset, limit };


    // get all users
    User.findAll({
      order: [['fname', 'ASC']],
      attributes: [
        'fname', 'lname', 'mname', 'email', 'roleId'
      ],
      ...hint
    })
    .then((users) => {
      if (users.length > 0) {
        return sendData(res, users, 200);
      }
      return sendError(res, 'No user found', 404);
    })
    .catch(error => sendError(res, error.message, 500));
  },
  /**
   * create a user and return jwt and user name and email
   * @param {*} req - client request
   * @param {*} res - server response
   * @return {object} - jwt
   */
  createUser(req, res) {
    // create object from request
    const user = req.body;
    // check for required fields
    if (user.fname && user.lname && user.email && user.password) {
      // check if  user already exist
      User
        .find({
          where: {
            email: user.email
          },
        })
        .then((foundUser) => {
          // if user exist exist return error
          if (foundUser) {
            return sendError(res, 'Email already exist', 409);
          }
          User.create(user)
          .then(newuser =>
            returnJWt(res, newuser, 201)
          )
          .catch(err =>
            sendError(res, err.message, 500)
          );
        })
        .catch(err =>
          sendError(res, err.message, 500)
        );
    } else {
      sendError(res,
       'First name, last name, email, role  and password are compulsory.',
       400)
      ;
    }
  },
  /**
   * get a user by id
   * @param {*} req - client request
   * @param {*} res - server response
   * @return {object} - user
   */
  getUser(req, res) {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return sendError(res, 'Invalid user ID', 400);
    }
    // get user with this id
    User.findOne({
      where: { id: userId },
      attributes: ['id', 'fname', 'lname', 'mname', 'email', 'roleId']
    })
    .then((user) => {
      if (!user) {
        return sendError(res, 'User not found.', 404);
      }
      return sendData(res, user, 200);
    })
    .catch(error => sendError(res, error.message, 500));
  },
  /**
   * detele user by id
   * @param {*} req - client request
   * @param {*} res - server response
   * @return {string } - user fullname
   */
  deleteUser(req, res) {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return sendError(res, 'Invalid user ID', 400);
    }
    // get user with this id
    User.findOne({
      where: { id: userId }
    })
    .then((user) => {
      if (!user) {
        return sendError(res, 'User not found.', 200);
      }
      return user
      .destroy()
      .then(() => sendData(res,
      `${user.fname} ${user.mname} ${user.lname}`, 200))
      .catch(error => sendError(res, error.message, 400));
    })
    .catch(error => sendError(res, error.message, 400));
  },
   /**
   * - update registered users
   * @param {*} req - client request
   * @param {*} res - server response
   * @return {object} - user
   */
  updateUser(req, res) {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return sendError(res, 'Invalid user ID', 400);
    }
    // check if user wants to update his role
    if (req.body.role) {
      return sendError(res, 'Invalid operation', 403);
    }

    // check if old password was provide
    const curPassword = req.body.curPassword;
    // check if user changed her email
    if (curPassword) {
      // find user
      User.findOne({
        where: { id: userId }
      })
      .then((foundUser) => {
        if (!foundUser) {
          return sendError(res,
         'Unauthorized operation, check the credential provided', 403);
        }
        const pass = bcrypt.compareSync(curPassword, foundUser.password);
        if (pass) {
          // create changes
          const changes = {
            fname: req.body.fname,
            lname: req.body.lname,
            mname: req.body.mname,
            email: req.body.email
          };
          // check if the user wants to change her password
          if (req.body.password !== '') {
            changes.password = req.body.password;
          }
          return foundUser
            .update({ ...changes })
            .then(() => returnJWt(res, foundUser, 200))
            .catch(error => sendError(res, error.message, 500));
        }
        return sendError(res,
         'Unauthorized operation, check the credential provided', 403);
      });
      // .catch(error => sendError(res, error.message, 500));
    }
    return sendError(res,
    'Unauthorized operation, check the credential provided', 403);
  },
   /**
   * - search for users with a list of attributes
   * @param {*} req - client request
   * @param {*} res - server response
   * @return {object} - users
   */
  lookupUser(req, res) {
    // get new user info
    const query = req.query;
    // get user with this id
    User.findAll({
      where: { ...query },
      attributes: ['id', 'fname', 'lname', 'mname', 'email', 'roleId']
    })
    .then((users) => {
      if (!users) {
        return sendError(res, 'No user was found.', 200);
      }
      return sendData(res, users, 200);
    })
    .catch(error => sendError(res, error.message, 400));
  },
   /**
   * - get a list of registered user's documents
   * @param {*} req - client request
   * @param {*} res - server response
   * @return {object} - documents
   */
  getUserDocument(req, res) {
    // get user with this id
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return sendError(res, 'Invalid user ID', 400);
    }
    if (userId !== req.user.id) {
      return sendError(res, 'User not found.', 200);
    }
    User.findOne({
      where: { id: userId }
    })
    .then((user) => {
      if (!user) {
        return sendError(res, 'User not found.', 200);
      }
      // return user's documents
      return Document.findAll({
        where: { owner: userId },
      })
      .then((documents) => {
        if (!documents) {
          return sendError(res, 'Document not found.', 200);
        }
        return sendData(res, documents, 200);
      })
      .catch(error => sendError(res, error.message, 500));
    })
    .catch(error => sendError(res, error.message, 500));
  }
};
