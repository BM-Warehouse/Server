const AuthService = require('@services/auth.service');
const bcrypt = require('@libs/bcrypt');
const jwt = require('@libs/jwt');
const { BadRequest, UnauthorizedError } = require('@exceptions/error.excecptions');

class AuthController {
  static async register(req, res, next) {
    try {
      const {
        email,
        username,
        password,
        fullName,
        phone,
        address,
        gender,
        birthdate,
        avatar,
        role,
      } = req.body;

      if (!email || !username || !password) {
        throw new BadRequest(
          'Invalid body parameter',
          'Email, username, and password are required fields',
        );
      }

      const hashPass = bcrypt.hashPassword(password);

      const user = await AuthService.register(
        email,
        username,
        hashPass,
        fullName,
        phone,
        address,
        gender,
        birthdate,
        avatar,
        role,
      );

      res.status(201).json({ data: user, message: 'User added successfully' });
    } catch (e) {
      next(e);
    }
  }

  static login = async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const foundUser = await AuthService.findUserByUsername(username);

      // const foundCart = await AuthService.findCartbyUserId(foundUser.id);

      if (bcrypt.comparePassword(password, foundUser.password)) {
        const accessToken = jwt.generateToken({
          userId: foundUser.id,
          // cartId: foundCart.id,
          username: foundUser.username,
          role: foundUser.role,
        });
        res.status(200).json({ message: 'Login succesfully', accessToken });
      } else {
        throw new UnauthorizedError('Unauthorized', 'The password entered is incorrect');
      }
    } catch (e) {
      next(e);
    }
  };
}

module.exports = AuthController;
