module.exports = {
  /**
   * send error message to client
   * @param {*} res - server response object
   * @param {*} message - error message
   */
   sendError(res, message ,statusCode){
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
   sendData(res, data ,statusCode){
    res.status(statusCode).send({
      status: 'success',
      data
    });
  }
}