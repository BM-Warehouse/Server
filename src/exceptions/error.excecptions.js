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

class NotFoundError extends ClientError {
  constructor(message, detail = undefined) {
    super(message, errorType.NOT_FOUND, 404, detail);
  }
}

class ConflictError extends ClientError {
  constructor(message, detail = undefined) {
    super(message, errorType.CONFLICT, 409, detail);
  }
}

class UnauthorizedError extends ClientError {
  constructor(message, detail = undefined) {
    super(message, errorType.UNAUTHORIZED, 401, detail);
  }
}

class ForbiddenError extends ClientError {
  constructor(message, detail = undefined) {
    super(message, errorType.UNAUTHORIZED, 403, detail);
  }
}

module.exports = {
  ClientError,
  BadRequest,
  InternalServerError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
};
