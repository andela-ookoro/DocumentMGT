import bcrypt from 'bcrypt-nodejs';
import model from '../models/index';
import sequelize from ''
import { sendMessage, returnJWt, sendData } from './helpers/utilities';

const User = model.user;
const Document = model.document;
const docAttributes = [
  'id', 'title', 'synopsis', 'body', 'role', 'accessRight',
  'owner', 'author', 'createdAt', 'updatedAt']
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
      return User
        .find({
          where: {
            email: user.email
          },
        })
        .then((foundUser) => {
          if (foundUser) {
            const userPassword = foundUser.password;
             // check if user is disabled
            if (foundUser.status === 'disabled') {
              return sendMessage(res,
              'This account is blocked, Please account admin',
              401);
            }
            // compare password
            const pass = bcrypt.compareSync(user.password, userPassword);
            if (pass) {
              return returnJWt(res, foundUser.dataValues, 200);
            }
            return sendMessage(res, 'Wrong email or password.', 401);
          }
          return sendMessage(res, 'Wrong email or password.', 401);
        })
        .catch(err => sendMessage(res, err.message, 401));
    } else {
      return sendMessage(res, 'Email and password are compulsory.',
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
    let hint = {}
    const offset = parseInt(req.query.offset, 10) || 0;
    const limit = parseInt(req.query.limit, 6);
    if (req.query.offset || req.query.limit) {
      hint = { offset, limit };
    }

    // get all users
    return User.findAll({
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
      return sendMessage(res, 'No user was found', 404);
    })
    .catch(error => sendMessage(res, error.message, 500));
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
    if (user.fname && user.lname && user.email && user.password && user.roleId) {
      // check if  user already exist
     return  User.find({
          where: {
            email: user.email
          },
        })
        .then((foundUser) => {
          // if user exist exist return error
          if (foundUser) {
            sendMessage(res, 'Email already exist', 409);
          }
          return User.create(user)
            .then(newuser => returnJWt(res, newuser.dataValues, 201))
            .catch(err => sendMessage(res, err.message, 500));
        })
        .catch(err =>
          (sendMessage(res, err.message, 500))
        );
    } else {
      sendMessage(res,
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
      sendMessage(res, 'Invalid user ID', 400);
    }
    // get user with this id
    return User.findOne({
        where: { id: userId },
        attributes: ['id', 'fname', 'lname', 'mname', 'email', 'roleId']
      })
      .then((user) => {
        if (!user) {
          sendMessage(res, 'User was not found.', 404);
        }
        sendData(res, user, 200);
      })
      .catch(error => sendMessage(res, error.message, 500));
  },
  /**
   * detele user by id
   * @param {*} req - client request
   * @param {*} res - server response
   * @return {string } - user fullname
   */
  deleteUser(req, res) {
    // convert param to int
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return sendMessage(res, 'Invalid user ID', 400);
    }

    // get user with this id
    return User.findOne({
        where: { id: userId }
      })
      .then((user) => {
        if (!user) {
          sendMessage(res, 'User was not found.', 200);
        }

        return user
        .update({ status: 'disabled' })
        .then(() => sendData(res, 'User has been blocked successfully', 200))
        .catch(error => sendMessage(res, error.message, 400));
      })
      .catch(error => sendMessage(res, error.message, 400));
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
      sendMessage(res, 'Invalid user ID', 400);
    }
    // only an admin can update a user's role
    if (req.body.role && req.user.role !== 3) {
      return sendMessage(res, 'Invalid operation', 403);
    } // only an admin update another user's profile
    else if (req.user.role !== 3 && userId !== req.user.id ) {
      return sendMessage(res, 'Invalid operation', 403);
    }

    // check if old password was provide
    const curPassword = req.body.curPassword;
    if (curPassword) {
      // find user
      return User.findOne({
          where: { id: userId }
        })
        .then((foundUser) => {
          if (!foundUser) {
           sendMessage(res, 'User was not found', 200);
          }
          // verify user's password
          const pass = bcrypt.compareSync(curPassword, foundUser.password);
          const test =  bcrypt.hashSync(curPassword, bcrypt.genSaltSync(10));
          const test1 =  bcrypt.hashSync(curPassword);
          console.log(foundUser.dataValues, curPassword,pass, test, test1)
          if (pass) {
            // create changes
            const changes = {
              fname: req.body.fname || foundUser.fname,
              lname: req.body.lname || foundUser.lname,
              mname: req.body.mname || foundUser.mname,
              email: req.body.email || foundUser.email,
              roleId: req.body.roleId || foundUser.roleId
            };
            // check if the user wants to change her password
            if (req.body.password) {
              changes.password = req.body.password;
            }
            return foundUser
              .update({ ...changes })
              .then(updateUser => returnJWt(res, updateUser.dataValues, 200))
              .catch(error => {
                console.log(error);
                return sendMessage(res, error.message, 500)
              });
          }
          return sendMessage(res,
          'Unauthorized operation, check the credential provided1',
          403);
        })
        .catch(error => {
          const message = error.message || error.toString()
          console.log(error);
          return sendMessage(res, message, 500)
        });
    }
    return sendMessage(res,
    'Unauthorized operation, check the credential provided2', 403);
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
    return User.findAll({
        where: { ...query },
        attributes: ['id', 'fname', 'lname', 'mname', 'email', 'roleId']
      })
      .then((users) => {
        if (!users) {
          sendMessage(res, 'No user was found.', 200);
        }
         sendData(res, users, 200);
      })
      .catch(error => sendMessage(res, error.message, 400));
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
      return sendMessage(res, 'Invalid user ID', 400);
    }
    if (userId !== req.user.id) {
      return sendMessage(res, 'User was not found.', 200);
    }
    return User.findOne({
        where: { id: userId }
      })
      .then((user) => {
        if (!user) {
          return sendMessage(res, 'User was not found.', 200);
        }
        // return user's documents
       return  Document.findAll({
          where: { owner: userId },
          attributes: docAttributes
        })
        .then((documents) => {
          if (!documents) {
           return sendMessage(res, 'Document was not found.', 200);
          }
          return sendData(res, documents, 200);
        })
        .catch(error => sendMessage(res, error.message, 500));
      })
      .catch(error => sendMessage(res, error.message, 500));
  }
};
