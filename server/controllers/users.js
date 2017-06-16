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
  logout(req, res) {},
  getUsers(req, res) {},
  /**
   * create a user and return jwt and user name and email
   * @param {*} req - client request
   * @param {*} res - server response
   */
  createUser(req, res) { 
    // create user
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
  getUser(req, res) { },
  deleteUser(req, res) { },
  updateUser(req, res) { }, 
  lookupUser(req, res) { }
};