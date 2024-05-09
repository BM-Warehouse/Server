/* eslint-disable no-console */
const prisma = require('@src/libs/prisma');
// const {
//   InternalServerError,
//   ClientError,
//   NotFoundError,
//   BadRequest,
//   ConflictError,
// } = require('@exceptions/error.excecptions');

class CartService {
  static async getAllCarts() {
    try {
      const carts = await prisma.cart.findMany({
        include: {
          ProductCart: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          id: 'asc',
        },
      });
      return carts;
      // const carts = await prisma.cart.findMany();
    } catch (err) {
      console.log(err);
    }
  }

  static async fetchCart(userId) {
    console.log(userId, '<<<<<<<<<<<<<<');
    try {
      const cart = await prisma.cart.findUnique({
        where: { userId }, // Menggunakan userId sebagai kunci pencarian
        include: {
          ProductCart: {
            include: {
              product: true,
            },
          },
        },
      });
      return cart;
    } catch (err) {
      console.log(err);
    }
  }

  static async deleteCartProduct(params) {
    try {
      console.log(params);
      // const { orderCartId } = params;
      const productCartDeleted = await prisma.productCart.delete({
        where: {
          productId_cartId: {
            cartId: +params.cartId,
            productId: +params.productId,
          },
        },
      });
      return productCartDeleted;
    } catch (error) {
      console.log(error);
    }
  }

  static async resetCartToDefault(userId) {
    await prisma.$transaction([
      prisma.cart.update({
        where: { userId },
        data: {
          totalPrice: 0,
          status: 'not checkouted',
        },
        include: {
          user: true,
          ProductCart: true,
        },
      }),
      prisma.productCart.deleteMany({
        where: {
          cart: {
            userId: userId,
          },
        },
      }),
    ]);

    return prisma.cart.findUnique({
      where: { userId: userId },
      include: {
        user: true,
        ProductCart: true,
      },
    });
  }

  static async addProductToCart({ productId, cartId, quantity }) {
    // console.log(productId, cartId);
    try {
      // -------- validasi ------- //
      const product = await prisma.product.findFirst({
        where: {
          id: productId,
        },
      });

      prisma.$transaction(async (tx) => {
        // ---- update productCart
        await tx.productCart.upsert({
          where: {
            productId_cartId: {
              cartId,
              productId,
            },
          },
          update: {
            quantityItem: {
              increment: +quantity,
            },
            productPrice: {
              increment: +quantity * product.price,
            },
          },
          create: {
            cartId,
            productId,
            quantityItem: +quantity,
            productPrice: +quantity * product.price,
          },
        });

        // ---- update cart
        await tx.cart.update({
          where: {
            id: cartId,
          },
          data: {
            totalPrice: {
              increment: +quantity * product.price,
            },
          },
        });
      });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = CartService;
