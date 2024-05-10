const prisma = require('@libs/prisma');
const {
  InternalServerError,
  ClientError,
  NotFoundError,
  ConflictError,
} = require('@exceptions/error.excecptions');

class UserService {
  static async getAllUsers({ page, limit }) {
    try {
      const users = await prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });

      return users;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Oops, something went wrong', e.message);
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
        throw new NotFoundError('No user found', `There is no user with id ${id}`);
      }

      return user;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Oops, something went wrong', e.message);
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
      return user;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Oops, something went wrong', e.message);
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
        throw new NotFoundError('No user found', `There is no user with id ${id}`);
      }

      const user = await prisma.user.update({
        where: {
          id: +id,
        },
        data: {
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

      return user;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Oops, something went wrong', e.message);
      } else {
        throw e;
      }
    }
  }

  static async destroyUser(id) {
    try {
      const foundUser = await this.getDetailUser(id);
      if (!foundUser) {
        throw new NotFoundError('No user found', `There is no user with id ${id}`);
      }

      const user = await prisma.user.delete({
        where: {
          id: +id,
        },
      });
      return user;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Oops, something went wrong', e.message);
      } else {
        throw e;
      }
    }
  }
}

module.exports = UserService;
