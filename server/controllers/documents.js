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
  getDocuments(req, res) {},
  createDocument(req, res) {
    console.log("came here ..............");
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
  getDocument(req, res) {},
  deleteDocument(req, res) { },
  updateDocument(req, res) { },
  getUserDocument(req, res) { },
  searchByTitle(req, res) { },
};