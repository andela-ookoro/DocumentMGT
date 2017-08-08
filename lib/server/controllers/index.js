'use strict';

var _roles = require('./roles');

var Role = _interopRequireWildcard(_roles);

var _documents = require('./documents');

var Document = _interopRequireWildcard(_documents);

var _users = require('./users');

var User = _interopRequireWildcard(_users);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

module.exports = {
  Role: Role,
  Document: Document,
  User: User
}; /**
    * file to centralise export of every controller
    */

// import each controller