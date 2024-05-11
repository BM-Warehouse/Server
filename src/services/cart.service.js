/* eslint-disable no-console */
const {
  ClientError,
  InternalServerError,
  NotFoundError,
} = require('@src/exceptions/error.excecptions');
const prisma = require('@src/libs/prisma');

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
    } catch (err) {
      if (!(err instanceof ClientError)) {
        throw new InternalServerError('Fail to get all cart user', err.message);
      } else {
        throw err;
      }
    }
  }

  static async showUserCart(userId) {
    try {
      const cart = await prisma.cart.findUnique({
        // Menggunakan userId sebagai kunci pencarian.
        where: { userId },
        include: {
          ProductCart: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!cart) {
        throw new NotFoundError('No product found', `There is no cart with id ${userId}`);
      }

      return cart;
    } catch (err) {
      if (!(err instanceof ClientError)) {
        throw new InternalServerError('Fail to get cart', err.message);
      } else {
        throw err;
      }
    }
  }

  static async addProductToCart(payload) {
    try {
      const { id, product } = payload;
      await prisma.$transaction(async (tx) => {
        // Mengecek cart user atau membuat cart user
        let cart = await tx.cart.findUnique({
          where: { userId: id },
        });

        if (!cart) {
          cart = await tx.cart.create({
            data: {
              id,
              userId: id,
              status: 'not checkouted',
              totalPrice: 0,
            },
          });
        }
        if (product) {
          const { productId, quantity } = product;

          if (!productId || !quantity) {
            throw new NotFoundError(
              'Invalid product data',
              'Product ID or quantity is missing or not valid',
            );
          }

          // Mengecek apakah produk sudah ada di cart berdasarkan id produk
          const existingProductCart = await tx.productCart.findFirst({
            where: {
              productId,
              cartId: cart.id,
            },
          });
          if (existingProductCart) {
            // Jika produk sudah ada di cart, maka hanya menambahkan quantity
            await tx.productCart.update({
              where: {
                productId_cartId: {
                  productId: existingProductCart.productId,
                  cartId: existingProductCart.cartId,
                },
              },
              data: {
                quantityItem: {
                  // MEnambah nilai dari quantity sebelumnya
                  increment: quantity,
                },
              },
            });
          } else {
            // Jika produk belum ada di cart, maka membuat produk baru
            const productData = await tx.product.findUnique({
              where: { id: productId },
            });

            const productPrice = productData.price;

            await tx.productCart.create({
              data: {
                productId,
                cartId: cart.id,
                quantityItem: quantity,
                productPrice,
              },
            });
          }
          // Mengabil data productCart dari Cart user
          const productsCart = await tx.productCart.findMany({
            where: { cartId: cart.id },
            include: {
              product: true,
            },
          });

          // Inisialisasi vriable untuk total price
          let totalPrice = 0;

          // Menghitung total price
          productsCart.forEach((productCart) => {
            totalPrice += productCart.product.price * productCart.quantityItem;
          });

          // console.log(totalPrice);

          // Update data Cart
          await tx.cart.update({
            where: { userId: id },
            data: {
              totalPrice,
            },
          });
        }
      });
      return prisma.cart.findUnique({
        where: { userId: id },
        include: {
          ProductCart: {
            include: {
              product: true,
            },
          },
        },
      });
    } catch (err) {
      if (!(err instanceof ClientError)) {
        throw new InternalServerError(
          'Oops, something went wrong',
          `An error occurred: ${err.message}`,
        );
      } else {
        throw err;
      }
    }
  }

  static async deleteCartProduct(payload) {
    try {
      const productCart = await prisma.productCart.findUnique({
        where: {
          productId_cartId: {
            cartId: +payload.userId,
            productId: +payload.productCartId,
          },
        },
      });

      if (!productCart) {
        throw new NotFoundError(
          'No product found',
          `There is no product with id ${payload.productCartId}`,
        );
      }

      const productCartDeleted = await prisma.productCart.delete({
        where: {
          productId_cartId: {
            // mengambil id cart berdasarkan id user login
            cartId: +payload.userId,
            productId: +payload.productCartId,
          },
        },
      });

      return productCartDeleted;
    } catch (err) {
      if (!(err instanceof ClientError)) {
        throw new InternalServerError('Fail to delete Product Cart to db', err.message);
      } else {
        throw err;
      }
    }
  }

  static async resetCartToDefault(userId) {
    try {
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
          ProductCart: true,
        },
      });
    } catch (err) {
      if (!(err instanceof ClientError)) {
        throw new InternalServerError('Fail to reset product cart user', err.message);
      } else {
        throw err;
      }
    }
  }
}

module.exports = CartService;
