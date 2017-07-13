import jwt from 'jsonwebtoken';
import model from '../../models/index';

const User = model.user;

module.exports = {
  /**
   * send error message to client
   * @param {object} res - server response objects
   * @param {string} message - error message
   * @param {int} statusCode - response code
   * @returns {object} -
   */
  sendError(res, message, statusCode) {
    return res.status(statusCode).send({
      status: 'fail',
      message
    });
  },
  /**
   *
   * @param {*} res - server response object
   * @param {*} data - data to be sent
   * @param {*} statusCode - status Code
   * @returns {object} -
   */
  sendData(res, data, statusCode) {
    return res.status(statusCode).send({
      status: 'success',
      data
    });
  },
  /**
   * validate user using jwt
   * @param {*} req - client request
   * @param {*} res - server response
   * @param {*} next - call the next route
   * @returns {object} -
   */
  validateUser(req, res, next) {
    if (!req.headers && !req.body && !req.query) {
      // if there is no data to process
      return res.status(401).send({
        message: 'No token provided.'
      });
    }
    const token = req.headers.authorization || req.body.token || req
    .query.token;
    // decoding the token
    if (token) {
      jwt.verify(token, process.env.TOKENSECRET, (error, decoded) => {
        if (error) {
          return res.status(401).send({
            message: 'Failed to authenticate token.'
          });
        }
        // check if user is disable
        User
        .find({
          where: {
            email: decoded.email
          },
        })
        .then((foundUser) => {
          if (foundUser) {
             // check if user is disabled
            if (foundUser.status === 'disabled') {
              return res.status(401).send({
                message: 'This account is blocked, Please account admin'
              });
            }
             // attach user info to the request object
            req.user = decoded;
            next();
          } else {
            return res.status(401).send({
              message: 'Wrong authentication credentials, ' +
              'please signin/signup again'
            });
          }
        })
        .catch(err => res.status(500).send({
          message: `Error occurred, please try again: ${err.message}`
        })
        );
      });
    } else {
      // if there is no token available return a message
      return res.status(401).send({ message: 'No token provided.' });
    }
  },
  /**
   * return user metadata and jwt to the user
   * @param {*} res server response object
   * @param {*} user user object
   * @param {*} statusCode status Code
   * @returns {null} -
   */
  returnJWt(res, user, statusCode) {
    // create jwt payload
    const userInfo = {
      email: user.email,
      name: `${user.fname} ${user.mname} ${user.lname}`,
      role: user.roleId,
      id: user.id
    };
    const jwtToken = jwt.sign(userInfo, process.env.TOKENSECRET);
    // send response to client
    return res.status(statusCode).send({
      status: 'success',
      userInfo,
      jwtToken
    });
  },

  /**
   * check if user is an admon
   * @param {*} req - client request
   * @param {*} res - server response
   * @param {*} next - call the next route
   * @returns {object} - next route or error message
   */
  adminOnly(req, res, next) {
    if (res.user.role === 3) {
      next();
    }
    return res.status(403).send({
      status: 'fail',
      message: 'Invalid Operation'
    });
  }
};
