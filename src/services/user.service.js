const prisma = require('@libs/prisma');

class UserService {
  static async getAllUsers() {
    const users = await prisma.user.findMany();

    return users;
  }

  static async getDetailUser(id) {
    const user = await prisma.user.findFirst({
      where: {
        id: +id,
      },
    });
    return user;
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
  }

  static async destroyUser(id) {
    await prisma.user.delete({
      where: {
        id: +id,
      },
    });
  }
}

module.exports = UserService;
