const AuthService = require('@services/auth.service');
const bcrypt = require('@libs/bcrypt');
const jwt = require('@libs/jwt');

class AuthController {
  static login = async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const foundUser = await AuthService.findUserByUsername(username);

      if (bcrypt.comparePassword(password, foundUser.password)) {
        const accessToken = jwt.generateToken({
          id: foundUser.id,
          username: foundUser.username,
          role: foundUser.role,
        });
        res.status(200).json({ message: 'Login succesfully', accessToken });
      } else {
        throw new Error('Passwordiswrong');
      }
    } catch (e) {
      next(e);
    }
  };
}

module.exports = AuthController;
