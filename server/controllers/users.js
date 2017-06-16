import jwt from 'jsonwebtoken';
import  bcrypt from 'bcrypt';
import model from '../models/index';

const User = model.user;

/**
 * return user metadata and jwt to the user
 * @param {*} res server response object
 * @param {*} user user object
 */
const returnJWt = (res, user, statusCode) => {
  // create jwt payload
  const tokenData = {
    email: user.email,
    name: user.getFullname()
  }
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
const sendError = (res, message ,statusCode) => {
   res.status(statusCode).send({
    status: 'fail',
    message
  });
}


module.exports = {
  //
  login(req, res) {
    // create object from request
    const user = req.body;

    // check for required fields
    if ( user.email && user.password ) {
      // get user with this email
      User
        .find({
            where: {
              email: user.email
            },
          })
        .then(foundUser => {
          if (foundUser) {
            const userPassword =  foundUser.password;
            // compare password
            bcrypt.compare(user.password, userPassword, function(err, pass) {
              if(pass) {
                return returnJWt(res, foundUser, 200);
              } 
              sendError(res, 'Wrong email or password.', 401);
            });
          } else {
            sendError(res, 'Wrong email or password.', 401);
          } 
        })
        .catch(err => {
          sendError(res, err.message);
        });
    } else {
      sendError(res, 'Email and password are compulsory.', 500);
    }
    
  },
  logout(req, res) {
      req.logout();
      res.redirect('/');
  },
  /**
   * - get a list of registered users
   * @param {*} req - client request
   * @param {*} res - server response
   */
  getUsers(req, res) {

    let hint;
    // check it limit and offset where passed
    if (req.query.offset && req.query.limit ) {
      hint = { offset: req.query.offset , limit: req.query.limit };
    }

    // get all users
    User.findAll({
       order: [['fname', 'ASC']],
      attributes: [
        'fname', 'lname', 'mname', 'email', 'roleId'
      ], ...hint
    })
    .then(users => res.status(200).send({
      status: 'success',
      users
    })
    )
    .catch(error => sendError(res, error.message, 500));
  },
  /**
   * create a user and return jwt and user name and email
   * @param {*} req - client request
   * @param {*} res - server response
   */
  createUser(req, res) { 
    // create object from request
    const user = req.body;

    // check for required fields
    if ( user.fname && user.lname && user.email && user.password) {
      User.create(user)
      .then(newuser => {
        returnJWt(res, newuser, 201);
      })
      .catch(err => {
        sendError(res, err.message, 500);
      });
    } else {
      sendError(res,
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
      where: {id: req.params.id},
      attributes: ['id', 'fname', 'lname', 'mname', 'email', 'roleId']
    })
    .then(user => {
      if (!user) {
        return sendError(res, 'User not found.', 200);
      }
      return res.status(200).send({
        status: 'success',
        user
      });
    })
    .catch(error => sendError(res, error.message, 400));
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
      where: {id: req.params.id}
    })
    .then(user => {
      if (!user) {
        return sendError(res, 'User not found.', 200);
      }
      return user
      .destroy()
      .then(() => res.status(200).send({status: 'success'}))  
      .catch((error) => sendError(res, error.message, 400));
    })
    .catch(error => sendError(res, error.message, 400));
  },
  updateUser(req, res) { 
    const userId = req.params.id;
    // get new user info
    const changes = req.body;
    // get user with this id
    User.findOne({
      where: {id: req.params.id}
    })
    .then(user => {
      if (!user) {
        return sendError(res, 'User not found.', 200);
      }
      return user
      .update({ ...changes })
      .then(() => res.status(200).send({
        status: 'success',
        user : {
          fname: user.fname,
          lname: user.lname,
          mname: user.mname,
          email: user.email,
          roleId: user.roleId,
          id: user.id
        }
      }))  
      .catch((error) => sendError(res,error.message, 400));
    })
    .catch(error => sendError(res, error.message, 400));
  }, 
  lookupUser(req, res) { }
};