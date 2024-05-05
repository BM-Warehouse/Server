const ClientError = require('@src/exceptions/clientError');

function errorHandler(err, res, next) {
  if (err instanceof ClientError) {
    res.status(err.statusCode).json(err.getObject());
  } else next();
}

module.exports = errorHandler;
