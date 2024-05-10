const jwt = require('@libs/jwt');
const AuthService = require('@services/auth.service');
const {
  UnauthorizedError,
  InternalServerError,
  ForbiddenError,
  ClientError,
} = require('@exceptions/error.excecptions');

class AuthMiddleware {
  static async authentication(req, res, next) {
    try {
      if (req.headers.authorization) {
        const accessToken = req.headers.authorization.split(' ')[1];

        if (!accessToken) {
          throw new UnauthorizedError(
            'Access token is missing',
            'The access token required for this operation is missing.',
          );
        }

        const decoded = await jwt.verifyToken(accessToken);

        if (!decoded) {
          throw new UnauthorizedError(
            'Invalid access token',
            'The access token provided is invalid or expired.',
          );
        } else {
          const result = await AuthService.findUserById(decoded.id);

          req.loggedUser = {
            id: result.id,
            username: result.username,
            role: result.role,
          };
          next();
        }
      } else {
        throw new UnauthorizedError(
          'Authorization header is missing',
          'The authorization header is required for this operation.',
        );
      }
    } catch (e) {
      if (!(e instanceof ClientError)) {
        next(
          new InternalServerError('Oops, something went wrong', `An error occurred: ${e.message}`),
        );
      } else {
        next(e);
      }
    }
  }

  static async authorization(req, res, next) {
    try {
      if (req.loggedUser.role === 'admin') next();
      else {
        throw new ForbiddenError(
          'Access denied: User does not have admin privileges',
          'This operation requires admin privileges.',
        );
      }
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError(
          'Oops, something went wrong',
          `An error occurred: ${e.message}`,
        );
      } else {
        throw e;
      }
    }
  }
}

module.exports = AuthMiddleware;
