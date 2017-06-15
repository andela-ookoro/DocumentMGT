/**
 * file to centralise export of every controller
 */

// import each controller
import  * as Role from './roles';
import * as Document from './documents';
import * as AccessRight from './accessRight';
import * as User from './users';

module.exports = {
  Role,
  Document,
  AccessRight,
  User
};
