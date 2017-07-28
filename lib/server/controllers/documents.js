'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _index = require('../models/index');

var _index2 = _interopRequireDefault(_index);

var _utilities = require('./helpers/utilities');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var User = _index2.default.user;
var Document = _index2.default.document;
var attributes = ['id', 'title', 'synopsis', 'body', 'role', 'accessRight', 'owner', 'author', 'createdAt', 'updatedAt'];

module.exports = {
  /**
  * - get a list of documents
  * @param {*} req - client request
  * @param {*} res - server response
  * @returns {object} - documents
  */
  getDocuments: function getDocuments(req, res) {
    var hint = void 0;
    var limit = void 0;
    var offset = void 0;
    // check it limit and offset where passed
    if (req.query.offset && req.query.limit) {
      offset = parseInt(req.query.offset, 10);
      limit = parseInt(req.query.limit, 10);
      hint = { limit: limit, offset: offset };
    } else {
      hint = {
        limit: 7,
        offset: 0
      };
    }
    // get all documents
    Document.findAndCountAll(_extends({
      attributes: attributes,
      where: {
        $or: (0, _utilities.authorizedDoc)(req.user)
      },
      order: [['title', 'ASC']]
    }, hint)).then(function (documents) {
      var count = documents.count;
      var rows = documents.rows;
      var documentsPayload = {
        count: count,
        rows: rows,
        curPage: parseInt(offset / limit, 10) + 1,
        pageCount: parseInt(count / limit, 10),
        pageSize: rows.length
      };
      return (0, _utilities.sendData)(res, documentsPayload, 200, 'documents');
    }).catch(function (error) {
      return (0, _utilities.sendMessage)(res, error.message, 500);
    });
  },

  /**
  * - create a document
  * @param {*} req - client request
  * @param {*} res - server response
  * @returns {null} - null
  */
  createDocument: function createDocument(req, res) {
    // create object from request
    var document = req.body;
    // check for 
    if (document.owner !== req.user.id) {
      return (0, _utilities.sendMessage)(res, 'Unauthorized operation', 403);
    }
    // check for required fields
    if (document.title && document.body) {
      // get owner name
      User.findOne({
        where: { id: req.user.id },
        attributes: ['fname', 'lname', 'mname']
      }).then(function (user) {
        document.author = user.fname + ' ' + user.mname + ' ' + user.lname;
        Document.create(document).then(function (newdocument) {
          return (0, _utilities.sendData)(res, newdocument, 201, 'document');
        }).catch(function (err) {
          return (0, _utilities.sendMessage)(res, err.message, 500);
        });
      }).catch(function (error) {
        return (0, _utilities.sendMessage)(res, error.message, 500);
      });
    } else {
      return (0, _utilities.sendMessage)(res, 'Document\'s title and body are compulsory.', 400);
    }
  },

  /**
  * - get a document by id
  * @param {*} req - client request
  * @param {*} res - server response
  * @returns {object} - document
  */
  getDocument: function getDocument(req, res) {
    // get document with this id
    var docID = parseInt(req.params.id, 10);
    if (isNaN(docID)) {
      return (0, _utilities.sendMessage)(res, 'Invalid document ID', 400);
    }
    Document.findOne({
      attributes: attributes,
      where: {
        $or: (0, _utilities.authorizedDoc)(req.user),
        id: docID
      }
    }).then(function (document) {
      if (!document) {
        return (0, _utilities.sendMessage)(res, 'Document not found.', 200);
      }
      return (0, _utilities.sendData)(res, document, 200, 'document');
    }).catch(function (error) {
      return (0, _utilities.sendMessage)(res, error.message, 400);
    });
  },

  /**
  * - delete a document by id
  * @param {*} req - client request
  * @param {*} res - server response
  * @returns {object} - document
  */
  deleteDocument: function deleteDocument(req, res) {
    // get document with this id
    var docID = parseInt(req.params.id, 10);
    if (isNaN(docID)) {
      return (0, _utilities.sendMessage)(res, 'Invalid document ID', 400);
    }
    Document.findOne({
      attributes: attributes,
      where: { id: docID, owner: req.user.id }
    }).then(function (document) {
      if (!document) {
        return (0, _utilities.sendMessage)(res, 'Document not found.', 200);
      }

      return document.destroy().then(function () {
        return (0, _utilities.sendData)(res, document, 200, 'document');
      }).catch(function (error) {
        return (0, _utilities.sendMessage)(res, error.message, 400);
      });
    }).catch(function (error) {
      return (0, _utilities.sendMessage)(res, error.message, 400);
    });
  },

  /**
  * - update a document by id
  * @param {*} req - client request
  * @param {*} res - server response
  * @returns {object} - document
  */
  updateDocument: function updateDocument(req, res) {
    // get new user info
    var changes = req.body;
    // disallow user form changing ownership
    if (changes.owner || changes.author) {
      return (0, _utilities.sendMessage)(res, 'Invalid operation, you can not change author', 400);
    }
    var docID = parseInt(req.params.id, 10);
    if (isNaN(docID)) {
      return (0, _utilities.sendMessage)(res, 'Invalid document ID', 400);
    }

    Document.findOne({
      where: { id: docID, owner: req.user.id },
      attributes: attributes
    }).then(function (document) {
      if (!document) {
        return (0, _utilities.sendMessage)(res, 'Document not found.', 200);
      }
      return document.update(changes).then(function () {
        return (0, _utilities.sendData)(res, document, 200, 'document');
      }).catch(function (error) {
        return (0, _utilities.sendMessage)(res, error.message, 400);
      });
    }).catch(function (error) {
      return (0, _utilities.sendMessage)(res, error.message, 400);
    });
  },

  /**
  * - get documents that has a list of attributes
  * @param {*} req - client request
  * @param {*} res - server response
  * @returns {object} - documents
  */
  searchByTitle: function searchByTitle(req, res) {
    // get new document info
    var query = void 0;
    var documentQuery = void 0;
    /**
     * Security check
     * ensure that request userid same as client id
     */
    var owner = req.query.owner || undefined;
    var title = req.query.title || '';
    var offset = parseInt(req.query.offset, 10) || 0;
    var limit = parseInt(req.query.limit, 10) || 7;
    var accessRight = req.query.accessRight || '';

    // ensure that a user does not access another user's document
    if (owner && owner !== req.user.id) {
      return (0, _utilities.sendMessage)(res, 'No document was found.', 401);
    }

    // remove offset and limit from query
    delete req.query.offset;
    delete req.query.limit;

    // edit query based on accessRight
    if (accessRight !== '') {
      switch (accessRight) {
        case 'public':
          break;
        case 'private':
          req.query.owner = req.user.id;
          break;
        case 'role':
          req.query.role = req.user.role;
          break;
        case 'myDocument':
          // set the owner to login user and delete the access right
          req.query.owner = req.user.id;
          delete req.query.accessRight;
          break;
        default:
          return (0, _utilities.sendMessage)(res, 'No document was found.', 401);
      }
      if (req.query.title === '') {
        delete req.query.title;
      }
      query = req.query;
      documentQuery = Document.findAndCountAll({
        attributes: attributes,
        where: _extends({}, query),
        offset: offset,
        limit: limit,
        order: [['title', 'ASC']]
      });
    }

    if (title !== '') {
      documentQuery = Document.findAndCountAll({
        attributes: attributes,
        where: {
          $or: (0, _utilities.authorizedDoc)(req.user),
          title: {
            $iLike: '%' + title + '%'
          }
        },
        offset: offset,
        limit: limit,
        order: [['title', 'ASC']]
      });
    }

    // if title and accessright where not specified
    if (title === '' && accessRight === '') {
      documentQuery = Document.findAndCountAll({
        attributes: attributes,
        where: {
          $or: (0, _utilities.authorizedDoc)(req.user)
        },
        offset: offset,
        limit: limit,
        order: [['title', 'ASC']]
      });
    }
    // get the documents
    documentQuery.then(function (documents) {
      if (documents.length < 1) {
        return (0, _utilities.sendMessage)(res, 'No document was found.', 200);
      }
      var count = documents.count;
      var rows = documents.rows;
      var documentsPayload = {
        count: count,
        rows: rows,
        curPage: parseInt(offset / limit, 10) + 1,
        pageCount: parseInt(count / limit, 10),
        pageSize: rows.length
      };
      return (0, _utilities.sendData)(res, documentsPayload, 200, 'documents');
    }).catch(function (error) {
      return (0, _utilities.sendMessage)(res, error.message, 500);
    });
  }
};