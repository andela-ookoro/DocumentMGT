import model from '../models/index';
import {sendMessage, sendData, authorizedDoc } from './helpers/utilities';

const User = model.user;
const Document = model.document;
const attributes = [
  'id', 'title', 'synopsis', 'body', 'role', 'accessRight',
  'owner', 'author', 'createdAt', 'updatedAt'];

module.exports = {
   /**
   * - get a list of documents
   * @param {*} req - client request
   * @param {*} res - server response
   * @returns {object} - documents
   */
  getDocuments(req, res) {
    let hint;
    let limit;
    let offset;
    // check it limit and offset where passed
    if (req.query.offset && req.query.limit) {
      offset = parseInt(req.query.offset, 10);
      limit = parseInt(req.query.limit, 10);
      hint = { limit, offset };
    } else {
      hint = {
        limit: 7,
        offset: 0
      };
    }
    // get all documents
    Document.findAndCountAll({
      attributes,
      where: {
        $or: authorizedDoc(req.user)
      },
      order: [['title', 'ASC']],
      ...hint
    })
    .then(documents => {
      const count = documents.count;
      const rows = documents.rows;
      const documentsPayload = {
        count,
        rows,
        curPage: parseInt(offset/limit, 10)+1,
        pageCount: parseInt(count/limit, 10),
        pageSize: rows.length
      };
      return  sendData(res, documentsPayload, 200, 'documents');
    })
    .catch(error => sendMessage(res, error.message, 500));
  },
   /**
   * - create a document
   * @param {*} req - client request
   * @param {*} res - server response
   * @returns {null} - null
   */
  createDocument(req, res) {
    // create object from request
    const document = req.body;
    // check for 
    if (document.owner !== req.user.id) {
      return sendMessage(res, 'Unauthorized operation', 403);
    }
    // check for required fields
    if (document.title && document.body) {
      // get owner name
      User.findOne({
        where: { id: req.user.id },
        attributes: ['fname', 'lname', 'mname']
      })
      .then((user) => {
        document.author = `${user.fname} ${user.mname} ${user.lname}`;
        Document.create(document)
        .then((newdocument) => {
         return sendData(res, newdocument, 201, 'document');
        })
        .catch((err) => sendMessage(res, err.message, 500));
      })
      .catch(error => sendMessage(res, error.message, 500));
    } else {
     return  sendMessage(res, 'Document\'s title and body are compulsory.',
      400);
    }
  },
   /**
   * - get a document by id
   * @param {*} req - client request
   * @param {*} res - server response
   * @returns {object} - document
   */
  getDocument(req, res) {
    // get document with this id
    const docID = parseInt(req.params.id, 10);
    if (isNaN(docID)) {
      return sendMessage(res, 'Invalid document ID', 400);
    }
    Document.findOne({
      attributes,
      where: {
        $or: authorizedDoc(req.user),
        id: docID
      }
    })
    .then((document) => {
      if (!document) {
        return sendMessage(res, 'Document not found.', 200);
      } 
      return sendData(res, document, 200, 'document');
    })
    .catch(error => sendMessage(res, error.message, 400));
  },
   /**
   * - delete a document by id
   * @param {*} req - client request
   * @param {*} res - server response
   * @returns {object} - document
   */
  deleteDocument(req, res) {
    // get document with this id
    const docID = parseInt(req.params.id, 10);
    if (isNaN(docID)) {
      return sendMessage(res, 'Invalid document ID', 400);
    }
    Document.findOne({
      attributes,
      where: { id: docID, owner: req.user.id }
    })
    .then((document) => {
      if (!document) {
        return sendMessage(res, 'Document not found.', 200);
      }

      return document
      .destroy()
      .then(() => sendData(res, document, 200, 'document'))
      .catch(error => sendMessage(res, error.message, 400));
    })
    .catch(error => sendMessage(res, error.message, 400));
  },
   /**
   * - update a document by id
   * @param {*} req - client request
   * @param {*} res - server response
   * @returns {object} - document
   */
  updateDocument(req, res) {
    // get new user info
    const changes = req.body;
    // disallow user form changing ownership
    if (changes.owner || changes.author) {
      return sendMessage(res, 'Invalid operation, you can not change author', 400);
    }
    const docID = parseInt(req.params.id, 10);
    if (isNaN(docID)) {
      return sendMessage(res, 'Invalid document ID', 400);
    }

    Document.findOne({
      where: { id: docID, owner: req.user.id },
      attributes
    })
    .then((document) => {
      if (!document) {
        return sendMessage(res, 'Document not found.', 200);
      }
      return document
      .update(changes)
      .then(() =>
         sendData(res, document, 200, 'document')
      )
      .catch(error => sendMessage(res, error.message, 400));
    })
    .catch(error => sendMessage(res, error.message, 400));
  },
   /**
   * - get documents that has a list of attributes
   * @param {*} req - client request
   * @param {*} res - server response
   * @returns {object} - documents
   */
  searchByTitle(req, res) {
    // get new document info
    let query;
    let documentQuery;
    /**
     * Security check
     * ensure that request userid same as client id
     */
    const owner = req.query.owner || undefined;
    const title = req.query.title || '';
    const offset = parseInt(req.query.offset, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 7;
    const accessRight = req.query.accessRight || '';

    // ensure that a user does not access another user's document
    if (owner && owner !== req.user.id) {
      return sendMessage(res, 'No document was found.', 401);
    }

    // remove offset and limit from query
    delete req.query.offset;
    delete req.query.limit;

    // edit query based on accessRight
    if (accessRight !== '') {
      switch (accessRight) {
        case 'public' :
          break;
        case 'private' :
          req.query.owner = req.user.id;
          break;
        case 'role' :
          req.query.role = req.user.role;
          break;
        case 'myDocument' :
          // set the owner to login user and delete the access right
          req.query.owner = req.user.id;
          delete req.query.accessRight;
          break;
        default :
          return sendMessage(res, 'No document was found.', 401);
      }
      if (req.query.title === '') {
        delete req.query.title;
      }
      query = req.query;
      documentQuery = Document.findAndCountAll({
        attributes,
        where: { ...query },
        offset,
        limit,
        order: [['title', 'ASC']],
      });
    }

    if (title !== '') {
      documentQuery = Document.findAndCountAll({
        attributes,
        where: {
          $or: authorizedDoc(req.user),
          title: {
            $iLike: `%${title}%`
          }
        },
        offset,
        limit,
        order: [['title', 'ASC']],
      });
    }

    // if title and accessright where not specified
    if (title === '' && accessRight === '') {
      documentQuery = Document.findAndCountAll({
        attributes,
        where: {
          $or: authorizedDoc(req.user),
        },
        offset,
        limit,
        order: [['title', 'ASC']],
      });
    }
    // get the documents
    documentQuery
    .then((documents) => {
      if (documents.length < 1) {
        return sendMessage(res, 'No document was found.', 200);
      }
      const count = documents.count;
      const rows = documents.rows;
      const documentsPayload = {
        count,
        rows,
        curPage: parseInt(offset/limit, 10)+1,
        pageCount: parseInt(count/limit, 10),
        pageSize: rows.length
      };
      return  sendData(res, documentsPayload, 200, 'documents');
    })
    .catch(error => sendMessage(res, error.message, 500));
  },
};
