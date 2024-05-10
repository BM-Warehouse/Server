const jwt = require('@libs/jwt');
const AuthService = require('@services/auth.service');

class AuthMiddleware {
  static async authentication(req, res, next) {
    if (req.headers.authorization) {
      const accessToken = req.headers.authorization.split(' ')[1];

      try {
        const decoded = await jwt.verifyToken(accessToken);
        const result = await AuthService.findUserById(decoded.id);
        if (!result) {
          throw new Error('User not found');
        }
        req.loggedUser = {
          id: result.id,
          username: result.username,
          role: result.role,
        };
        next();
      } catch (error) {
        next(error);
      }
    } else {
      // Jika tidak ada token diberikan, kirim tanggapan JSON 'Unauthorized'
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
  }

  static async authorization(req, res, next) {
    if (req.loggedUser.role === 'admin') next();
    else {
      throw new Error('Unauthorized');
    }
  }
}

module.exports = AuthMiddleware;
