const prisma = require('@libs/prisma');

class AuthService {
  static async findUserByUsername(username) {
    const foundUser = await prisma.user.findFirst({
      where: {
        username,
      },
    });
    if (!foundUser) {
      throw new Error('Usernotfound');
    }
    return foundUser;
  }

  static async findUserById(id) {
    const findById = await prisma.user.findFirst({
      where: {
        id: +id,
      },
    });
    if (!findById) {
      throw new Error('Idnotfound');
    }
    return findById;
  }
}

module.exports = AuthService;
