import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt-nodejs';
import model from '../../models/index';

const User = model.user;
const Role = model.role;
module.exports = {
  /**
   * send error message to client
   * @param {object} res - server response objects
   * @param {string} message - error message
   * @param {int} statusCode - response code
   * @returns {object} -
   */
  sendMessage(res, message, statusCode) {
   res.status(statusCode).send({
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
  sendData(res, data, statusCode, dataType) {
    // create response payload
    const payload = {
      status: 'success'
    };
    payload[dataType] = data;
    res.status(statusCode).send({ ...payload });
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
      res.status(401).send({
        message: 'No token provided.'
      });
    }
    const token = req.headers.authorization || req.body.token || req
    .query.token;
    // decoding the token
    if (token) {
      jwt.verify(token, process.env.TOKENSECRET, (error, decoded) => {
        if (error) {
          res.status(401).send({
            message: 'Failed to authenticate token.'
          });
          return;
        }
        // check if user is disable
        User
        .find({
          where: {
            id: decoded.id
          },
        })
        .then((foundUser) => {
          if (foundUser) {

             // react to user status
             const accountStatus = foundUser.status;
             switch (accountStatus) {
               case 'disabled':
                res.status(401).send({
                  message: 'This account is blocked, Please contact the admin'
                });
                break;
              case 'inactive':
                res.status(401).send({
                  message: 'This account does not exist'
                });
                break;
              case 'active':
                // attach user info to the request object
                req.user = decoded;
                next();
                break;
              default:
                res.status(401).send({
                  message: 'Invalid operation, check your credentials'
                });
             }
            return;
          } else {
            res.status(401).send({
              message: 'Wrong authentication credentials, ' +
              'please signin/signup again'
            });
           return;
          }
        })
        .catch(err => res.status(500).send({
          message: `Error occurred, please try again: ${err.message}`
        })
        );
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
  returnJWt(res, user, statusCode) {
    // get user role title
    Role.findOne({
      where: { id: user.roleId }
    })
    .then((role) => {
      if (!role) {
        return sendMessage(res, 'Role not found.', 200);
      }
      // create jwt payload
      // create middle name initial
      const middleNameInitial = (user.mname) ?
      `${user.mname.charAt(0)}.` : '';
      const userInfo = {
        name: `${user.fname} ${middleNameInitial} ${user.lname}`,
        role: role.id,
        title: role.title,
        id: user.id
      };
      // put isAdmin only for an admin
      if (user.isAdmin) {
        userInfo.isAdmin = true;
      }
      const jwtToken = jwt.sign(userInfo, process.env.TOKENSECRET);
      // send response to client
      res.status(statusCode).send({
        status: 'success',
        userInfo,
        jwtToken
      });
      return;
    })
    .catch(error => sendMessage(res, error.message, 400));
  },

  /**
   * check if user is an admin
   * @param {*} req - client request
   * @param {*} res - server response
   * @param {*} next - call the next route
   * @returns {object} - next route or error message
   */
  adminOnly(req, res, next) {
    if (req.user.isAdmin) {
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
  encryptString(value) {
   return  bcrypt.hash(value, null, null, (err, hash) => {
      if (hash) {
        return hash;
      } else {
        throw err;
      }
    });
  },

  /**
   * @summary function to get the authorized list of document
   * @param {any} user 
   * @returns {array} - an array of criteria
   */
  authorizedDoc(user) {
    // for a regulat user
    let citeria = [
      {
        accessRight: 'role',
        role: user.role
      },
      {
        accessRight: 'private',
        owner: user.id
      },
      {
        accessRight: 'public',
      }
    ];
    if (user.isAdmin) {
      // all admin to view all role document
      delete citeria[0].role;
    }
    return citeria;
  }
};
