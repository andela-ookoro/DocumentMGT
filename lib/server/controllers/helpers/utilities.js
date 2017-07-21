'use strict';

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _bcryptNodejs = require('bcrypt-nodejs');

var _bcryptNodejs2 = _interopRequireDefault(_bcryptNodejs);

var _index = require('../../models/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var User = _index2.default.user;
var Role = _index2.default.role;
module.exports = {
  /**
   * send error message to client
   * @param {object} res - server response objects
   * @param {string} message - error message
   * @param {int} statusCode - response code
   * @returns {object} -
   */
  sendMessage: function sendMessage(res, message, statusCode) {
    res.status(statusCode).send({
      status: 'fail',
      message: message
    });
  },

  /**
   *
   * @param {*} res - server response object
   * @param {*} data - data to be sent
   * @param {*} statusCode - status Code
   * @returns {object} -
   */
  sendData: function sendData(res, data, statusCode) {
    res.status(statusCode).send({
      status: 'success',
      data: data
    });
  },

  /**
   * validate user using jwt
   * @param {*} req - client request
   * @param {*} res - server response
   * @param {*} next - call the next route
   * @returns {object} -
   */
  validateUser: function validateUser(req, res, next) {
    if (!req.headers && !req.body && !req.query) {
      // if there is no data to process
      res.status(401).send({
        message: 'No token provided.'
      });
    }
    var token = req.headers.authorization || req.body.token || req.query.token;
    // decoding the token
    if (token) {
      _jsonwebtoken2.default.verify(token, process.env.TOKENSECRET, function (error, decoded) {
        if (error) {
          res.status(401).send({
            message: 'Failed to authenticate token.'
          });
          return;
        }
        // check if user is disable
        User.find({
          where: {
            email: decoded.email
          }
        }).then(function (foundUser) {
          if (foundUser) {
            // check if user is disabled
            if (foundUser.status === 'disabled') {
              res.status(401).send({
                message: 'This account is blocked, Please contact the admin'
              });
            }
            // attach user info to the request object
            req.user = decoded;
            next();
            return;
          } else {
            res.status(401).send({
              message: 'Wrong authentication credentials, ' + 'please signin/signup again'
            });
            return;
          }
        }).catch(function (err) {
          return res.status(500).send({
            message: 'Error occurred, please try again: ' + err.message
          });
        });
      });
    } else {
      // if there is no token available return a message
      res.status(401).send({ message: 'No token provided.' });
    }
  },

  /**
   * return user metadata and jwt to the user
   * @param {*} res server response object
   * @param {*} user user object
   * @param {*} statusCode status Code
   * @returns {null} -
   */
  returnJWt: function returnJWt(res, user, statusCode) {

    // get user role title
    Role.findOne({
      where: { id: user.roleId }
    }).then(function (role) {
      if (!role) {
        return sendMessage(res, 'Role not found.', 200);
      }
      // create jwt payload
      var userInfo = {
        email: user.email,
        name: user.fname + ' ' + user.mname + ' ' + user.lname,
        role: role.id,
        title: role.title,
        id: user.id
      };
      var jwtToken = _jsonwebtoken2.default.sign(userInfo, process.env.TOKENSECRET);
      // send response to client
      res.status(statusCode).send({
        status: 'success',
        userInfo: userInfo,
        jwtToken: jwtToken
      });
      return;
    }).catch(function (error) {
      return sendMessage(res, error.message, 400);
    });
  },


  /**
   * check if user is an admin
   * @param {*} req - client request
   * @param {*} res - server response
   * @param {*} next - call the next route
   * @returns {object} - next route or error message
   */
  adminOnly: function adminOnly(req, res, next) {
    if (req.user.title === 'admin') {
      next();
      return;
    }
    res.status(403).send({
      status: 'fail',
      message: 'Invalid Operation'
    });
  },


  /**
   * encrypt any string
   * @param {string} value 
   * @returns {object} - brcpty hash function
   */
  encryptString: function encryptString(value) {
    return _bcryptNodejs2.default.hash(value, null, null, function (err, hash) {
      if (hash) {
        return hash;
      } else {
        throw err;
      }
    });
  }
};