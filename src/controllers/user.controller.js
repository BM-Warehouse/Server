const UserService = require('@services/user.service');

class UserController {
  static async getAllUsers(req, res, next) {
    try {
      const users = await UserService.getAllUsers();
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
      const { email, password, fullname, phone, address, gender, birthdate, avatar, role } =
        req.body;
      const user = await UserService.createUser(
        email,
        password,
        fullname,
        phone,
        address,
        gender,
        birthdate,
        avatar,
        role,
      );
      res.status(201).json({ data: user, message: 'User added succesfully' });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = UserController;
