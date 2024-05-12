const prisma = require('@libs/prisma');
const {
  ConflictError,
  InternalServerError,
  ClientError,
  NotFoundError,
} = require('@exceptions/error.excecptions');

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

      const user = prisma.$transaction(async (tx) => {
        let user = await tx.user.create({
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

        const cart = await tx.cart.create({
          data: {
            totalPrice: 0,
            userId: user.id,
          },
        });

        user = {
          ...user,
          cartId: cart.id,
        };

        return user;
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

  static async findUserByUsername(username) {
    try {
      const foundUser = await prisma.user.findFirst({
        where: {
          username,
        },
      });
      if (!foundUser) {
        throw new NotFoundError('User not found', `No user was found with the ID: ${username}`);
      }
      return foundUser;
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

  static async findUserById(id) {
    try {
      const findById = await prisma.user.findFirst({
        where: {
          id: +id,
        },
      });
      if (!findById) {
        throw new NotFoundError('User not found', `No user was found with the ID: ${id}`);
      }
      return findById;
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

  static async findCartbyUserId(id) {
    try {
      const findCart = await prisma.cart.findUnique({
        where: {
          userId: +id,
        },
      });
      if (!findCart) {
        throw new NotFoundError('Cart is not found', `Cart with userId ${id} is not exist.`);
      }
      return findCart;
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

module.exports = AuthService;
