const prisma = require('@libs/prisma');

class UserService {
  static async getAllUsers() {
    const users = await prisma.user.findMany();

    return users;
  }

  static async getDetailUser() {
    const user = await prisma.user.findFirst({
      where: {
        id: +id,
      },
    });
    return user;
  }

  static async createUser() {
    const user = await prisma.user.create({
      data: {
        email,
        password,
        fullName,
        phone,
        address,
        gender,
        birthdate,
        avatar,
        role,
      },
    });
    return user;
  }
}

module.exports = UserService;
