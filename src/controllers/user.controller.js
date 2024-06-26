const { hashPassword } = require('@libs/bcrypt.js');
const UserService = require('@services/user.service');
const { BadRequest } = require('@exceptions/error.excecptions');
const { successResponse } = require('@src/responses/responses');
const { getPaginationStatus } = require('@src/libs/pagination');

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

class UserController {
  static async getAllUsers(req, res, next) {
    try {
      let { page, limit } = req.query;

      if ((page && isNaN(page)) || (limit && isNaN(limit))) {
        throw new BadRequest('Invalid query parameter', 'Limit and page must be a number');
      }

      page = +page || DEFAULT_PAGE;
      limit = +limit || DEFAULT_LIMIT;

      req.query = {
        ...req.query,
        page,
        limit,
      };

      const users = await UserService.getAllUsers(req.query);
      const totalCount = await UserService.getAllCount();
      const pagination = getPaginationStatus(page, limit, totalCount);

      if (!pagination) {
        throw new BadRequest('Pagination Error', 'Failed to retrieve pagination status');
      }

      res.status(200).json(successResponse({ users, pagination }, 'Get all Users success'));
    } catch (e) {
      next(e);
    }
  }

  static async getDetailUser(req, res, next) {
    try {
      const { id } = req.params;

      if (id && isNaN(id)) {
        throw new BadRequest('Invalid key parameter', 'ID must be a valid number');
      }

      const user = await UserService.getDetailUser(id);
      res.status(200).json(successResponse({ user }, 'Get detail User success'));
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

      if (!email || !username || !password) {
        throw new BadRequest(
          'Invalid body parameter',
          'Email, username, and password are required fields',
        );
      }

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
      res.status(201).json(successResponse({ user }, 'User added successfully'));
    } catch (e) {
      next(e);
    }
  }

  static async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { username, password, email, name, phone, address, gender, birthdate, avatar, role } =
        req.body;

      const hashPass = password ? hashPassword(password) : null;

      if (id && isNaN(id)) {
        throw new BadRequest('Invalid key parameter', 'ID must be a valid number');
      }

      const user = await UserService.updateUser(
        id,
        username,
        hashPass,
        name,
        email,
        phone,
        address,
        gender,
        birthdate,
        avatar,
        role,
      );
      res.status(200).json(successResponse({ user }, 'User updated successfully'));
    } catch (e) {
      next(e);
    }
  }

  static async destroyUser(req, res, next) {
    try {
      const { id } = req.params;

      if (id && isNaN(id)) {
        throw new BadRequest('Invalid key parameter', 'ID must be a valid number');
      }

      await UserService.destroyUser(id);
      res.status(200).json(successResponse('User deleted successfully'));
    } catch (e) {
      next(e);
    }
  }

  static async getLoginUser(req, res, next) {
    try {
      const { userId } = req.loggedUser;

      const me = await UserService.getLoginUser(+userId);

      res.status(200).json(successResponse({ me }, 'Data login user successfully retrieved'));
    } catch (e) {
      next(e);
    }
  }
}

module.exports = UserController;
