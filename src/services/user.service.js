const prisma = require('@libs/prisma');

class UserService {
  static async getAllUsers({ page, limit }) {
    try {
      const users = await prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });

      return users;
    } catch (e) {
      throw new e();
    }
  }

  static async getDetailUser(id) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: +id,
        },
      });
      return user;
    } catch (e) {
      throw new e();
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
      throw new e();
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
      throw new e();
    }
  }

  static async destroyUser(id) {
    try {
      await prisma.user.delete({
        where: {
          id: +id,
        },
      });
    } catch (e) {
      throw new e();
    }
  }
}

module.exports = UserService;
