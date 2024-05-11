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
      // console.log(payload);
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

          // Mengecek apakah produk sudah ada di cart berdasarkan id produk
          const existingProductCart = await tx.productCart.findFirst({
            where: {
              productId,
              cartId: cart.id,
            },
          });
          // console.log(existingProductCart, '<<<<<<<<<<<<<<<<<<<<<<<<<');
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
            // console.log(quantity);
            const productData = await tx.product.findUnique({
              where: { id: productId },
            });

            const productPrice = productData.price;

            // console.log(price);
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

          // console.log(productsCart);

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
        ProductCart: true,
      },
    });
  }
}

module.exports = CartService;
