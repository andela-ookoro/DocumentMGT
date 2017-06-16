import jwt from 'jsonwebtoken';
import model from '../models/index';

const User = model.user;

module.exports = {
  //
  login(req, res) {},
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
      .then((newuser) => {
        // create jwt payload
        const tokenData = {
          email: newuser.email,
          name: newuser.getFullname()
        }
        const jwtToken = jwt.sign(tokenData, process.env.TOKENSECRET);

        // send response to client
        res.status(201).send({
          status: 'success',
          data: newuser,
          jwtToken
        })
      })
      .catch((err) => {
        res.status(500).send({
          status: 'fail',
          message: err.message,
        })
      });
    } else {
      res.status(500).send({
          status: 'fail',
          message: 'First name, last name, email and password are compulsory.'
       })
    }
  },
  getUser(req, res) { },
  deleteUser(req, res) { },
  updateUser(req, res) { }, 
  lookupUser(req, res) { }
};