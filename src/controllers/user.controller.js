const { hashPassword } = require('@libs/bcrypt.js');
const UserService = require('@services/user.service');

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

class UserController {
  static async getAllUsers(req, res, next) {
    try {
      let { page, limit } = req.query;

      page = +page || DEFAULT_PAGE;
      limit = +limit || DEFAULT_LIMIT;

      const users = await UserService.getAllUsers({
        page,
        limit,
      });
      res.status(200).json(users);
    } catch (e) {
      next(e);
    }
  }

  static async getDetailUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UserService.getDetailUser(id);
      res.status(200).json(user);
    } catch (e) {
      next(e);
    }
  }

  static async createUser(req, res, next) {
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

      const hashPass = hashPassword(password);
      const user = await UserService.createUser(
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

  static async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { username, password, fullName, phone, address, gender, birthdate, avatar, role } =
        req.body;

      const user = await UserService.updateUser(
        id,
        username,
        password,
        fullName,
        phone,
        address,
        gender,
        birthdate,
        avatar,
        role,
      );

      res.status(200).json({ data: user, message: 'User updated successfully' });
    } catch (e) {
      next(e);
    }
  }

  static async destroyUser(req, res, next) {
    try {
      const { id } = req.params;
      await UserService.destroyUser(id);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = UserController;
