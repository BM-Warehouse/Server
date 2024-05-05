const errorType = require('../constants/errorType');
class ClientError {
  constructor(
    message = 'Internal Server Error',
    type = errorType.INTERNAL_SERVER_ERROR,
    statusCode = 500,
    details = undefined,
  ) {
    this.statusCode = statusCode;
    this.type = type;
    this.message = message;
    this.details = details;
  }

  getObject() {
    return {
      type: this.type,
      message: this.message,
      details: this.details,
    };
  }
}

class BadRequest extends ClientError {
  constructor(message, detail = undefined) {
    super(message, errorType.BAD_REQUEST, 400, detail);
  }
}

class InternalServerError extends ClientError {
  constructor(message, detail = undefined) {
    super(message, errorType.INTERNAL_SERVER_ERROR, 500, detail);
  }
}

module.exports = {
  ClientError,
  BadRequest,
  InternalServerError,
};
