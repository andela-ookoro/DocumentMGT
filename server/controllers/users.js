import bcrypt from 'bcrypt-nodejs';
import Sequelize from 'sequelize';
import model from '../models/index';
import { sendMessage, returnJWt, sendData } from './helpers/utilities';
import sequelizeConfig from '../config/config.json';
// connect to postgres
const env = process.env.NODE_ENV || 'development';
const DBconfig = sequelizeConfig[env];

let sequelize;
if (DBconfig.use_env_variable) {
  sequelize = new Sequelize(process.env[DBconfig.use_env_variable]);
} else {
  sequelize = new Sequelize(
    DBconfig.database, DBconfig.username, DBconfig.password, DBconfig
  );
}

// create Object hasOwnProperty
const has = Object.prototype.hasOwnProperty;

const User = model.user;
const Document = model.document;
const docAttributes = [
  'id', 'title', 'synopsis', 'body', 'role', 'accessRight',
  'owner', 'author', 'createdAt', 'updatedAt'];

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
          where: { email: user.email }
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
        .catch(err => sendMessage(res, `${err.message || err}`, 401));
    }
    return sendMessage(res, 'Email and password are compulsory.', 401);
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
    const limit = parseInt(req.query.limit, 10) || 6;

    /**
     * build dynamic where clause from query parameter
     * delete offset and limit from request query
     * loop through query parameter to build a dynamic where clause
     */
    let whereClause = '';
    const criteria = req.query;
    delete criteria.limit;
    delete criteria.offset;
    delete criteria.token;
    let criterion;
    Object.keys(criteria).forEach((key) => {
      if (has.call(criteria, key)) {
        criterion = ` users.${key} iLike '%${criteria[key]}%'`;
        if (whereClause === '') {
          whereClause = `where  ${criterion}`;
        } else {
          whereClause = `${whereClause} and ${criterion}`;
        }
      }
    });


    const fetchRangeQuery = `
     select CONCAT(fname, ' ', mname, ' ', lname) AS name,
     users.id AS id,
     users.status AS status,
     users.email AS email,
     count(documents.id) AS DocCount,
     "users"."createdAt" AS "createdAt",
     "roles"."title" as role
     from "roles"
     inner join "users"
     on "users"."roleId" = "roles"."id"
     left join documents 
     on users.id = documents.owner
     ${whereClause}
     group by documents.owner,fname,lname,
       fname, users.id,users.status,"roles"."title"
     order by users.fname
     offset ${offset}
     limit ${limit};`;

    // get count of users for pagnition
    const getUsersCount = `
      select count(id) as count from users
      ${whereClause}
      ;`;

    return sequelize.query(fetchRangeQuery)
    .then((result) => {
      const users = result[0];
      if (users.length > 0) {
        // create object to store users fetch and total number of users
        const usersPayload = {
          rows: users,
          pageSize: users.length
        };
        // get total number of users in category
        return sequelize.query(getUsersCount)
        .then((countResult) => {
          const count = countResult[0][0].count;
          let pageCount = parseInt(count / limit, 10);
          pageCount = (pageCount < (count / limit))
          ? (pageCount + 1) : pageCount;
          usersPayload.pageCount = pageCount;
          usersPayload.curPage = parseInt(offset / limit, 10) + 1;
          usersPayload.count = parseInt(count, 10);
          return sendData(res, usersPayload, 200, 'users');
        })
        .catch(error => sendMessage(res, error.message, 500));
      }
      return sendMessage(res, 'No user was found', 200);
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
    if (user.fname && user.lname
      && user.email && user.password && user.roleId) {
      // check if  user already exist
      return User.find({
        where: {
          email: user.email
        },
      })
      .then((foundUser) => {
        // if user exist exist return error
        if (foundUser) {
          // when account has been blocked
          switch (foundUser.status) {
            case disabled:
              sendMessage(res,
                'This account is blocked, Please account admin',
                401);
              break;
            default:
              sendMessage(res, 'Email already exist', 409);
          }
        }
        return User.create(user)
          .then(newuser => returnJWt(res, newuser.dataValues, 201))
          .catch(err => sendMessage(res, err.message, 500));
      })
      .catch(err =>
        (sendMessage(res, err.message, 500))
      );
    }
    sendMessage(res,
      'First name, last name, email, role  and password are compulsory.',
      400);
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
      return sendMessage(res, 'Invalid user ID', 400);
    }
    // disallow regular users from view other user profile
    if (!req.user.isAdmin && userId !== req.user.id) {
      return sendMessage(res,
        'Unathorized operation, please check user id passed', 500);
    }
    const fetchUserQuery = `
     select fname, lname, mname, "users"."roleId", "roles"."title" , email
     from users 
     inner join roles
     on "users"."roleId" = "roles".id
     where "users"."id"= ${userId}`;
    sequelize.query(fetchUserQuery)
    .then((result) => {
      const user = result[0][0];
      if (!user) {
        return sendMessage(res, 'User was not found.', 404);
      }
      return sendData(res, user, 200, 'user');
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
    const userId = parseInt(req.user.id, 10);
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

        /**
         * change user status
         * set email to <delete+email>, to enable future signup
         */
        return user
        .update({
          status: 'inactive',
          email: `delete${user.email}`
        })
        .then(() => sendData(res,
        'Your account has been deleted', 200, 'message'))
        .catch(error => sendMessage(res, error.message, 400));
      })
      .catch(error => sendMessage(res, error.message, 400));
  },
  /**
   * block user by id
   * @param {*} req - client request
   * @param {*} res - server response
   * @return {string } - user fullname
   */
  blockUser(req, res) {
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
        .then(() => sendData(res,
        'User has been blocked successfully', 200, 'message'))
        .catch(error => sendMessage(res, error.message, 400));
      })
      .catch(error => sendMessage(res, error.message, 400));
  },
   /**
   * restore user by id
   * @param {*} req - client request
   * @param {*} res - server response
   * @return {string } - user fullname
   */
  restoreUser(req, res) {
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
        .update({ status: 'active' })
        .then(() => sendData(res,
        'User has been restored successfully', 200, 'messsage'))
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
    if (req.body.role && req.user.title !== 'admin') {
      return sendMessage(res, 'Invalid operation', 403);
    } // only an admin update another user's profile
    else if (req.user.title !== 'admin' && userId !== req.user.id) {
      return sendMessage(res, 'Invalid operation', 403);
    }
    // get update from request body
    const update = req.body;
    // check if old password was provide
    const curPassword = req.body.curPassword;
    // find user
    return User.findOne({
      where: { id: userId }
    })
    .then((foundUser) => {
      if (!foundUser) {
        return sendMessage(res, 'User was not found', 200);
      }

      // check if user old password, check if password was updated
      if (update.password) {
        const pass = bcrypt.compareSync(curPassword, foundUser.password);
        if (!pass) {
          return sendMessage(res,
          'Unauthorized operation, check the credential provided',
          403);
        }
      }
      return foundUser
        .update({ ...update })
        .then(updateUser => returnJWt(res, updateUser.dataValues, 200))
        .catch((error) => {
          const message = error.message || error.toString();
          return sendMessage(res, message, 500);
        });
    })
    .catch((error) => {
      const message = error.message || error.toString();
      return sendMessage(res, message, 500);
    });
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
    return User.findAndCountAll({
      where: { ...query },
      attributes: ['id', 'fname', 'lname', 'mname', 'email', 'roleId']
    })
      .then((users) => {
        if (users) {
          sendMessage(res, 'No user was found.', 200);
        }
        sendData(res, users, 200, 'user');
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
    // get pagination
    const offset = parseInt(req.query.offset, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 7;
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
        return Document.findAndCountAll({
          where: { owner: userId },
          attributes: docAttributes,
          offset,
          limit,
        })
        .then((documents) => {
          if (!documents) {
            return sendMessage(res, 'Document was not found.', 200);
          }
          const count = documents.count;
          const rows = documents.rows;
          const documentsPayload = {
            count,
            rows,
            curPage: parseInt(offset / limit, 10) + 1,
            pageCount: parseInt(count / limit, 10),
            pageSize: rows.length
          };
          return sendData(res, documentsPayload, 200, 'documents');
        })
        .catch(error => sendMessage(res, error.message, 500));
      })
      .catch(error => sendMessage(res, error.message, 500));
  }
};
