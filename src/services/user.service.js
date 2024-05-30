const prisma = require('@libs/prisma');
const {
  InternalServerError,
  ClientError,
  NotFoundError,
  ConflictError,
} = require('@exceptions/error.excecptions');

class UserService {
  static filterUndefinedAndNull = (obj) => {
    return Object.fromEntries(
      // eslint-disable-next-line no-unused-vars
      Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null),
    );
  };

  static async getAllUsers({ page, limit, orderType, orderBy, contains }) {
    let where = {};
    let orderInfo;
    const ORDER_TYPE_DEFAULT = 'asc';

    if (contains) {
      where.email = {
        contains,
        mode: 'insensitive',
      };
    }
    if (orderBy === 'id') {
      orderInfo = {
        id: orderType || ORDER_TYPE_DEFAULT,
      };
    } else if (orderBy === 'email') {
      orderInfo = {
        email: orderType || ORDER_TYPE_DEFAULT,
      };
    } else if (orderBy === 'username') {
      orderInfo = {
        username: orderType || ORDER_TYPE_DEFAULT,
      };
    } else if (orderBy === 'fullName') {
      orderInfo = {
        fullName: orderType || ORDER_TYPE_DEFAULT,
      };
    }

    try {
      const users = await prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: orderInfo,
      });

      if (!users || users.length === 0) {
        throw new NotFoundError(
          'Users not found',
          'No users found for the specified page, limit, and criteria',
        );
      }

      return users;
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

  static async getAllCount() {
    try {
      const userCount = await prisma.user.count();

      if (!userCount) {
        throw new NotFoundError('User not found', 'No users were found in the database');
      }
      return userCount;
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

  static async getDetailUser(id) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: +id,
        },
      });

      if (!user) {
        throw new NotFoundError('User not found', `No user was found with the ID: ${id}`);
      }

      return user;
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

  static async createUser(
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
  ) {
    try {
      const foundUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      });

      if (foundUser) {
        throw new ConflictError(
          'Data conflict of user',
          'The user with email or username already exists!',
        );
      }

      const user = await prisma.user.create({
        data: {
          email,
          username,
          password,
          fullName,
          phone,
          address,
          gender,
          birthdate: new Date(birthdate),
          avatar,
          role,
        },
      });

      if (!user) {
        throw new NotFoundError('User not created', 'Failed to create user');
      }

      return user;
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

  static async updateUser(
    id,
    username,
    password,
    fullName,
    email,
    phone,
    address,
    gender,
    birthdate,
    avatar,
    role,
  ) {
    try {
      const foundUser = await this.getDetailUser(id);

      if (!foundUser) {
        throw new NotFoundError('User not found', `No user was found with the ID: ${id}`);
      }

      const data = this.filterUndefinedAndNull({
        username,
        password,
        fullName,
        email,
        phone,
        address,
        gender,
        birthdate: new Date(birthdate),
        avatar,
        role,
      });

      const user = await prisma.user.update({
        where: {
          id: +id,
        },
        data,
      });

      if (!user) {
        throw new NotFoundError('User not updated', 'Failed to update user');
      }

      return user;
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

  static async destroyUser(id) {
    try {
      const foundUser = await this.getDetailUser(id);

      if (!foundUser) {
        throw new NotFoundError('User not found', `No user was found with the ID: ${id}`);
      }

      const user = await prisma.user.delete({
        where: {
          id: +id,
        },
      });

      return user;
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

  static async getLoginUser(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new NotFoundError('User not found', `No user was found with the ID: ${userId}`);
      }

      return user;
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

module.exports = UserService;
