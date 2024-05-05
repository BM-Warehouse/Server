const { ClientError } = require('@src/exceptions/error.excecptions');

function errorHandler(err, req, res, next) {
  if (err instanceof ClientError) {
    res.status(err.statusCode).json(err.getObject());
  } else next();
}

module.exports = errorHandler;
