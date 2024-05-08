const prisma = require('@libs/prisma');

class AuthService {
  static async register(
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

  static async findUserByUsername(username) {
    try {
      const foundUser = await prisma.user.findFirst({
        where: {
          username,
        },
      });
      if (!foundUser) {
        throw new Error('Usernotfound');
      }
      return foundUser;
    } catch (e) {
      throw new e();
    }
  }

  static async findUserById(id) {
    try {
      const findById = await prisma.user.findFirst({
        where: {
          id: +id,
        },
      });
      if (!findById) {
        throw new Error('Idnotfound');
      }
      return findById;
    } catch (e) {
      throw new e();
    }
  }
}

module.exports = AuthService;
