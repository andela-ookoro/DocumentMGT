import model from '../models/index';
import Utilities from './helpers/utilities';

const User = model.user;
const Document = model.document;

module.exports = {
   /**
   * - get a list of documents
   * @param {*} req - client request
   * @param {*} res - server response
   */
  getDocuments(req, res) {
    let hint;
    // check it limit and offset where passed
    if (req.query.offset && req.query.limit) {
      hint = { offset: req.query.offset, limit: req.query.limit };
    }
    console.log('gintdddddd......', hint);
    // get all documents
    Document.findAndCountAll({
      order: [['title', 'ASC']],
      ...hint
    })
    .then(documents => res.status(200).send({
        status: 'success',
        documents
      })
    )
    .catch(error => Utilities.sendError(res, error.message, 500));
  },
   /**
   * - create a document
   * @param {*} req - client request
   * @param {*} res - server response
   */
  createDocument(req, res) {
    // create object from request
    const document = req.body;
    // check for required fields
    if (document.title && document.body && (document.owner === req.user.id)) {
      // get owner name
      User.findOne({
        where: { id: req.user.id },
        attributes: ['fname', 'lname', 'mname']
      })
      .then((user) => {
        document.author = `${user.fname} ${user.mname} ${user.lname}`;
        Document.create(document)
        .then((newdocument) => {
          Utilities.sendData(res, newdocument, 201);
        })
        .catch((err) => {
          Utilities.sendError(res, err.message, 500);
        });
      })
      .catch(error => Utilities.sendError(res, error.message, 400));
    } else {
      Utilities.sendError(res, 'Document\'s title and body are compulsory.', 500);
    }
  },
   /**
   * - get a document by id
   * @param {*} req - client request
   * @param {*} res - server response
   */
  getDocument(req, res) {
    // get document with this id
    Document.findOne({
      where: { id: req.params.id }
    })
    .then((document) => {
      if (!document) {
        return Utilities.sendError(res, 'Document not found.', 200);
      } else if (document.accessRight === 'private' && document.owner !== req.user.id) {
        return Utilities.sendError(res, 'Document not found.', 200);
      } else if ( document.accessRight === 'role') {
        if (document.role !== req.user.role && document.owner !== req.user.id ) {
          return Utilities.sendError(res, 'Document not found2.', 200);
        } else {
          return Utilities.sendData(res, document, 200);
        }
      } else {
       return Utilities.sendData(res, document, 200);
      }
    })
    .catch(error => Utilities.sendError(res, error.message, 400));
  },
   /**
   * - delete a document by id
   * @param {*} req - client request
   * @param {*} res - server response
   */
  deleteDocument(req, res) {
    // get document with this id
    Document.findOne({
      where: { id: req.params.id, owner: req.user.id }
    })
    .then((document) => {
      if (!document) {
        return Utilities.sendError(res, 'Document not found.', 200);
      }

      return document
      .destroy()
      .then(() => Utilities.sendData(res, document, 200))
      .catch(error => Utilities.sendError(res, error.message, 400));
    })
    .catch(error => Utilities.sendError(res, error.message, 400));
  },
   /**
   * - update a document by id
   * @param {*} req - client request
   * @param {*} res - server response
   */
  updateDocument(req, res) {
    // get new user info
    const changes = req.body;
    // get user with this id
    Document.findOne({
      where: { id: req.params.id , owner: req.user.id }
    })
    .then((document) => {
      if (!document) {
        return Utilities.sendError(res, 'Document not found.', 200);
      }
      return document
      .update(changes)
      .then(() => Utilities.sendData(res, document, 200))
      .catch(error => Utilities.sendError(res, error.message, 400));
    })
    .catch(error => Utilities.sendError(res, error.message, 400));
  },
   /**
   * - get documents that has a list of attributes
   * @param {*} req - client request
   * @param {*} res - server response
   */
  searchByTitle(req, res) {
    let hint = {};
    // get new document info
    let query;
    let documentQuery;
    /**
     * Security check
     * ensure that request userid same as client id
     */
    const owner = req.query.owner || undefined;
    const title = req.query.title || '';
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 7;
    const accessRight = req.query.accessRight ||  '';

    // ensure that a user does not access another user's document
    if (owner && owner !== req.user.id) {
      return Utilities.sendError(res, 'No document was found.', 401);
    }

    console.log(',,,,,,,,,,,,,,,,,,,',offset,limit, req.query);
    // remove offset and limit from query 
    delete req.query.offset;
    delete req.query.limit
    console.log('req.body', req.query);

    // edit query based on accessRight
    if (accessRight !== '' ) {
      switch (accessRight) {
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
      }
      if (req.query.title === '') {
        delete req.query.title;
      }
      query = req.query;
      documentQuery =  Document.findAndCountAll({ 
        where: {...query},
        offset,
        limit,
        order: [['title', 'ASC']],
      });
    } 

    let documentSearch = [];
    let titleSearch;
    if(title !== '') {
      documentQuery =  Document.findAndCountAll({ 
        where: {
          $or: [
            {
              accessRight: 'role',
              role: req.user.role
            },
            {
              accessRight: 'private',
              owner: req.user.id
            },
            {
              accessRight: 'public',
            }
          ],
          title: {
            $iLike: '%' + title + '%'
          }
        },
        offset,
        limit,
        order: [['title', 'ASC']],
      });
    }
    // get the documents
    documentQuery
    .then((documents) => {
      if (!documents) {
        return Utilities.sendError(res, 'No document was found.', 200);
      }
      return Utilities.sendData(res, documents, 200);
    })
    .catch(error => Utilities.sendError(res, error.message, 400));
  },
};
