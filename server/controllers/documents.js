const Document = require('../models').document;

/**
 * send error message to client
 * @param {*} res - server response object
 * @param {*} message - error message
 */
const sendError = (res, message ,statusCode) => {
   res.status(statusCode).send({
    status: 'fail',
    message
  });
}

/**
 * 
 * @param {*} res - server response object
 * @param {*} data - data to be sent 
 * @param {*} statusCode - status Code
 */
const sendData = (res, data ,statusCode) => {
   res.status(statusCode).send({
    status: 'success',
    data
  });
}

module.exports = {
  //
  getDocuments(req, res) {
    let hint;
    // check it limit and offset where passed
    if (req.query.offset && req.query.limit ) {
      hint = { offset: req.query.offset , limit: req.query.limit };
    }

    // get all documents
    Document.findAll({
       order: [['title', 'ASC']],
       ...hint
    })
    .then(documents => res.status(200).send({
      status: 'success',
      documents
    })
    )
    .catch(error => sendError(res, error.message, 500));
  },
  createDocument(req, res) {
    // create object from request
    const document = req.body;

    // check for required fields
    if ( document.title && document.body) {
      Document.create(document)
      .then(newdocument => {
        sendData(res, newdocument, 201);
      })
      .catch(err => {
        sendError(res, err.message, 500);
      });
    } else {
      sendError(res, 'Document\'s title and body are compulsory.', 500);
    }
  },
  getDocument(req, res) {
    // get document with this id
    Document.findOne({
      where: {id: req.params.id},
    })
    .then(document => {
      if (!document) {
        return sendError(res, 'Document not found.', 200);
      }
      return sendData(res, document, 200);
    })
    .catch(error => sendError(res, error.message, 400));
  },
  deleteDocument(req, res) { 
    // get document with this id
    Document.findOne({
      where: {id: req.params.id}
    })
    .then(document => {
      if (!document) {
        return sendError(res, 'Document not found.', 200);
      }

      return document
      .destroy()
      .then(() =>  sendData(res, document, 200))  
      .catch((error) => sendError(res, error.message, 400));
    })
    .catch(error => sendError(res, error.message, 400));
  },
  updateDocument(req, res) {
    // get new user info
    const changes = req.body;
    // get user with this id
    Document.findOne({
      where: {id: req.params.id}
    })
    .then(document => {
      if (!document) {
        return sendError(res, 'Document not found.', 200);
      }
      return document
      .update({ ...changes })
      .then(() => sendData(res, document, 200))
      .catch((error) => sendError(res,error.message, 400));
    })
    .catch(error => sendError(res, error.message, 400));
  },
  searchByTitle(req, res) { },
};