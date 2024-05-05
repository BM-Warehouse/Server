const { ClientError } = require('@exceptions/error.excecptions');
const errorType = require('@constants/errorType');

function notFound(req, res, next) {
  const message = 'Not Found';
  const type = errorType.NOT_FOUND;
  const statusCode = 404;

  next(new ClientError(message, type, statusCode));
}

module.exports = notFound;
