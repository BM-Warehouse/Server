const jwt = require('@libs/jwt');
const AuthService = require('@services/auth.service');

const authentication = async (req, res, next) => {
  if (req.headers.authorization) {
    const accessToken = req.headers.authorization.split(' ')[1];

    const decoded = await jwt.verifyToken(accessToken);
    const result = await AuthService.findUserById(decoded.id);
    if (!result) {
      throw new Error('User not found');
    } else {
      req.loggedUser = {
        id: result.id,
        username: result.username,
        role: result.role,
      };
      next();
    }
  } else {
    throw new Error('Unauthorized');
  }
};

const authorization = async (req, res, next) => {
  if (req.loggedUser.role === 'admin') next();
  else {
    throw new Error('Unauthorized');
  }
};

module.exports = { authentication, authorization };
