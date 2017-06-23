import jwt from 'jsonwebtoken';
import model from '../../models/index';
const User = model.user;
const Document = model.document;
module.exports = {
  /**
   * send error message to client
   * @param {*} res - server response object
   * @param {*} message - error message
   */
  sendError(res, message, statusCode) {
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
   */
  sendData(res, data, statusCode) {
    res.status(statusCode).send({
      status: 'success',
      data
    });
  },
  /**
   * validate user using jwt
   * @param {*} req - client request
   * @param {*} res - server response
   * @param {*} next - call the next route
   */
  validateUser(req, res, next) {
    const token = req.headers.authorization || req.body.token || req.query.token;
    // decoding the token
    if (token) {
      jwt.verify(token, process.env.TOKENSECRET, (error, decoded) => {
        if (error) {
          return res.status(401).json({
            message: 'Failed to authenticate token.'
          });
        }
        req.decoded = decoded;
        console.log(decoded);
        next();
      });
    } else {
      // if there is no token available return a message
      return res.status(401).send({
        message: 'No token provided.'
      });
    }
  },
  /**
   * return user metadata and jwt to the user
   * @param {*} res server response object
   * @param {*} user user object
   * @param {*} statusCode status Code
   */
  returnJWt(res, user, statusCode) {
    // create jwt payload
    const userInfo = {
      email: user.email,
      name: `${user.fname} ${user.mname} ${user.lname}`,//user.getFullname(),
      role: user.roleId,
      id: user.id
    };
    const jwtToken = jwt.sign(userInfo, process.env.TOKENSECRET);

    // send response to client
    res.status(statusCode).send({
      status: 'success',
      userInfo,
      jwtToken
    });
  }
};
