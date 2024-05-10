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
    } catch (err) {
      console.log(err);
    }
  }

  static async showUserCart(userId) {
    try {
      const cart = await prisma.cart.findUnique({
        // Menggunakan userId sebagai kunci pencarian
        where: { userId },
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

  static async addProductToCart(payload) {
    try {
      console.log(payload);
      console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>');
      const { id, product } = payload;
      await prisma.$transaction(async (tx) => {
        // Mengecek cart user atau membuat cart user
        const cart = await tx.cart.findUnique({
          where: { userId: id },
        });
        if (product) {
          const { id: productId, price, quantity } = product;

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
              data: { productPrice: price, quantityItem: quantity },
            });
          } else {
            // Jika produk belum ada di cart, maka membuat produk baru
            await tx.productCart.create({
              data: {
                productId,
                cartId: cart.id,
                quantity,
                price,
              },
            });
          }
          // Mengabil data productCart dari Cart user
          const productsCart = await tx.productCart.findMany({
            where: { cartId: cart.id },
          });

          // Inisialisasi vriable untuk total price
          let totalPrice = 0;

          // Menghitung total price
          productsCart.forEach((productCart) => {
            totalPrice += productCart.productPrice * productCart.quantityItem;
          });

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
      console.log(err);
    }
  }

  static async deleteCartProduct(payload) {
    try {
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
}

module.exports = CartService;
