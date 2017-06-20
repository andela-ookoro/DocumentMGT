import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import model from '../models/index';
import Utilities from './helpers/utilities';

const User = model.user;
const Document = model.document;
/**
 * return user metadata and jwt to the user
 * @param {*} res server response object
 * @param {*} user user object
 * @param {*} statusCode status Code
 */
const returnJWt = (res, user, statusCode) => {
  // create jwt payload
  const tokenData = {
    email: user.email,
    name: user.getFullname(),
    role: user.roleId
  };
  const jwtToken = jwt.sign(tokenData, process.env.TOKENSECRET);

  // send response to client
  res.status(statusCode).send({
    status: 'success',
    data: tokenData,
    jwtToken
  });
};

/**
 * send error message to client
 * @param {*} res - server response object
 * @param {*} message - error message
 */
const sendError = (res, message, statusCode) => {
  res.status(statusCode).send({
    status: 'fail',
    message
  });
};

/**
 *
 * @param {*} res - server response object
 * @param {*} data - data to be sent
 * @param {*} statusCode - status Code
 */
const sendData = (res, data, statusCode) => {
  res.status(statusCode).send({
    status: 'success',
    data
  });
};


module.exports = {
   /**
   * - login registered users
   * @param {*} req - client request
   * @param {*} res - server response
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
            bcrypt.compare(user.password, userPassword, (err, pass) => {
              if (pass) {
                return Utilities.returnJWt(res, foundUser, 200);
              }
              Utilities.sendError(res, 'Wrong email or password.', 401);
            });
          } else {
            Utilities.sendError(res, 'Wrong email or password.', 401);
          }
        })
        .catch((err) => {
          Utilities.sendError(res, err.message);
        });
    } else {
      Utilities.sendError(res, 'Email and password are compulsory.', 500);
    }
  },
   /**
   * - logout user
   * @param {*} req - client request
   * @param {*} res - server response
   */
  logout(req, res) {
    req.logout();
    res.redirect('/');
  },
  /**
   * - get a list of registered users
   * @param {*} req - client requesit
   * @param {*} res - server response
   */
  getUsers(req, res) {
    let hint;
    // check it limit and offset where passed
    if (req.query.offset && req.query.limit) {
      hint = { offset: req.query.offset, limit: req.query.limit };
    }

    // get all users
    User.findAll({
      order: [['fname', 'ASC']],
      attributes: [
        'fname', 'lname', 'mname', 'email', 'roleId'
      ],
      ...hint
    })
    .then(users => Utilities.sendData(res, users, 200))
    .catch(error => Utilities.sendError(res, error.message, 500));
  },
  /**
   * create a user and return jwt and user name and email
   * @param {*} req - client request
   * @param {*} res - server response
   */
  createUser(req, res) {
    // create object from request
    const user = req.body;
    console.log('...............', req.body);
    // check for required fields
    if (user.fname && user.lname && user.email && user.password) {
      User.create(user)
      .then((newuser) => {
        Utilities.returnJWt(res, newuser, 201);
      })
      .catch((err) => {
        Utilities.sendError(res, err.message, 500);
      });
    } else {
      Utilities.sendError(res,
       'First name, last name, email and password are compulsory.',
       500);
    }
  },
  /**
   * get a user by id
   * @param {*} req - client request
   * @param {*} res - server response
   */
  getUser(req, res) {
    const userId = req.params.id;
    // get user with this id
    User.findOne({
      where: { id: req.params.id },
      attributes: ['id', 'fname', 'lname', 'mname', 'email', 'roleId']
    })
    .then((user) => {
      if (!user) {
        return Utilities.sendError(res, 'User not found.', 200);
      }
      return Utilities.sendData(res, user, 200);
    })
    .catch(error => Utilities.sendError(res, error.message, 400));
  },
  /**
   * detele user by id
   * @param {*} req - client request
   * @param {*} res - server response
   */
  deleteUser(req, res) {
    const userId = req.params.id;
    // get user with this id
    User.findOne({
      where: { id: req.params.id }
    })
    .then((user) => {
      if (!user) {
        return Utilities.sendError(res, 'User not found.', 200);
      }
      return user
      .destroy()
      .then(() => Utilities.sendData(res, user.getFullname, 200))
      .catch(error => Utilities.sendError(res, error.message, 400));
    })
    .catch(error => Utilities.sendError(res, error.message, 400));
  },
   /**
   * - update registered users
   * @param {*} req - client request
   * @param {*} res - server response
   */
  updateUser(req, res) {
    const userId = req.params.id;
    // get new user info
    const changes = req.body;
    // get user with this id
    User.findOne({
      where: { id: req.params.id }
    })
    .then((user) => {
      if (!user) {
        return Utilities.sendError(res, 'User not found.', 200);
      }
      return user
      .update({ ...changes })
      .then(() => Utilities.sendData(res, {
        fname: user.fname,
        lname: user.lname,
        mname: user.mname,
        email: user.email,
        roleId: user.roleId,
        id: user.id
      }, 200))
      .catch(error => Utilities.sendError(res, error.message, 400));
    })
    .catch(error => Utilities.sendError(res, error.message, 400));
  },
   /**
   * - search for users with a list of attributes
   * @param {*} req - client request
   * @param {*} res - server response
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
        return Utilities.sendError(res, 'No user was found.', 200);
      }
      return Utilities.sendData(res, users, 200);
    })
    .catch(error => Utilities.sendError(res, error.message, 400));
  },
   /**
   * - get a list of registered user's documents
   * @param {*} req - client request
   * @param {*} res - server response
   */
  getUserDocument(req, res) {
    // get user with this id
    console.log('..................', req.decode);
    User.findOne({
      where: { id: req.params.id }
    })
    .then((user) => {
      if (!user) {
        return Utilities.sendError(res, 'User not found.', 200);
      }
      // return user's documents
      return Document.findAll({
        where: { owner: req.params.id },
      })
      .then((documents) => {
        if (!documents) {
          return Utilities.sendError(res, 'Document not found.', 200);
        }
        return Utilities.sendData(res, documents, 200);
      })
      .catch(error => Utilities.sendError(res, error.message, 400));
    })
    .catch(error => Utilities.sendError(res, error.message, 400));
  }
};
