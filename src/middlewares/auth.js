const jwt = require('@libs/jwt');
const AuthService = require('@services/auth.service');
const {
  UnauthorizedError,
  InternalServerError,
  ForbiddenError,
  ClientError,
} = require('@exceptions/error.excecptions');
const prisma = require('@src/libs/prisma');

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
          const user = await AuthService.findUserById(decoded.userId);
          if (user) {
            req.loggedUser = decoded;
          } else {
            throw new UnauthorizedError(
              'Authorization error',
              `The user with id ${decoded.userId} is not exist!`,
            );
          }
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

  static async adminAuthorization(req, res, next) {
    try {
      if (req.loggedUser.role === 'admin') next();
      else {
        next(
          new ForbiddenError(
            'Access denied: User does not have admin privileges',
            'This operation requires admin privileges.',
          ),
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

  static async userAuthorization(req, res, next) {
    try {
      if (req.loggedUser.role === 'admin') next();
      else if (req.body.userId) {
        if (req.body.userId === req.loggedUser.userId) next();
        else
          next(
            new ForbiddenError('Access denied', `User with id ${req.body.userId} have no access.`),
          );
      } else if (req.body.checkoutId) {
        const checkout = await prisma.checkout.findUnique({
          where: {
            id: req.body.checkoutId,
          },
        });
        if (checkout.userId === req.loggedUser.userId) next();
        else
          next(
            new ForbiddenError(
              'Access denied',
              `Checkout with id ${req.body.checkoutId} is not belong to user with id ${req.loggedUser.userId}.`,
            ),
          );
      } else if (req.body.cartId) {
        if (req.body.cartId === req.loggedUser.cartId) next();
        else {
          next(
            new ForbiddenError(
              'Access denied',
              `User with id ${req.loggedUser.userId} have no access to cart with id ${req.body.cartId}.`,
            ),
          );
        }
      } else if (req.params.checkoutId) {
        const checkout = await prisma.checkout.findUnique({
          where: {
            id: req.params.checkoutId,
          },
        });
        if (checkout.userId === req.loggedUser.userId) next();
        else {
          next(
            new ForbiddenError(
              'Access denied',
              `Checkout with id ${req.body.checkoutId} is not belong to user with id ${req.loggedUser.userId}.`,
            ),
          );
        }
      } else {
        next(
          new ForbiddenError(
            'Access denied: User does not have admin privileges',
            'This operation requires admin privileges.',
          ),
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
}

module.exports = AuthMiddleware;
