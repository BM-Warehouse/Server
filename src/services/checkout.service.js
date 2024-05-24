const prisma = require('@libs/prisma');
const {
  InternalServerError,
  ClientError,
  NotFoundError,
  BadRequest,
  ConflictError,
} = require('@exceptions/error.excecptions');
const checkoutStatus = require('@constants/checkoutStatus');
const { emailSendOrderInfoToUser } = require('@src/libs/mailer');

class CheckoutService {
  static async #takeFromBatches(productId, warehouseId, quantityToTake, tx) {
    let stillNeedToTake = quantityToTake;
    let ret = [];
    //list semua batch
    let batches = await tx.batch.findMany({
      where: {
        productId: productId,
        warehouseId: warehouseId,
        stock: {
          gt: 0,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (!batches) {
      throw new NotFoundError(
        'No batch found',
        `Can't find any batch for product '${productId}' that still has stock available`,
      );
    }

    for (const batch of batches) {
      if (batch.stock < stillNeedToTake) {
        stillNeedToTake -= batch.stock;
        await tx.batch.update({
          where: {
            id: batch.id,
          },
          data: {
            stock: 0,
          },
        });

        ret.push({
          ...batch,
          stock: 0,
        });
      } else {
        await tx.batch.update({
          where: {
            id: batch.id,
          },
          data: {
            stock: batch.stock - stillNeedToTake,
          },
        });
        ret.push({
          ...batch,
          stock: batch.stock - stillNeedToTake,
        });
        // console.log(ret);
        return ret;
      }
    }

    // harusnya g pernah reach sini, klo sampek sini berarti ada kesalahan data
    throw new ConflictError(
      'Batches stock empty!!',
      'There are still item to be taken from batches',
    );
  }

  static async getAll({ page, limit }) {
    try {
      const checkouts = await prisma.checkout.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: true,
          couriers: true,
        },
      });

      const count = await prisma.checkout.count();

      return { checkouts, count };
    } catch (error) {
      if (!(error instanceof ClientError)) {
        throw new InternalServerError('Fail to process products', error);
      } else {
        throw error;
      }
    }
  }

  static async getDetail(id, filter) {
    const { limit, page } = filter;

    try {
      const checkout = await prisma.checkout.findFirst({
        where: {
          id: +id,
        },
        include: {
          productCheckout: {
            include: {
              product: true,
              warehouse: true,
            },
            orderBy: {
              productId: 'asc',
            },
            skip: (page - 1) * limit,
            take: limit,
          },
        },
      });

      if (!checkout) {
        throw new NotFoundError(
          'No Product process',
          `There is no product will process with id ${id}`,
        );
      }

      const count = await prisma.productCheckout.count({
        where: {
          checkoutId: +id,
        },
      });
      return { checkout, count };
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('failed to get details of the product being processed', e);
      } else {
        throw e;
      }
    }
  }
  static async add(payload) {
    try {
      const { userId, address, method, courierId, status } = payload;
      if (!userId || !address || !method || !courierId || !status) {
        throw new BadRequest(
          'Invalid body parameter',
          'userId, address, method, courierId, status cannot be empty!',
        );
      }

      const courier = await prisma.courier.findUnique({
        where: {
          id: +courierId,
        },
      });

      const checkout = await prisma.checkout.create({
        data: {
          userId,
          address,
          method,
          courierId: +courierId,
          status,
          totalPrice: courier.price,
        },
      });

      return checkout;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Failed to add checkout to database', e);
      } else {
        throw e;
      }
    }
  }
  static async update(id, payload) {
    try {
      const { method, address, courierId } = payload;

      let checkout = await prisma.checkout.findFirst({
        where: {
          id: +id,
        },
        include: {
          couriers: true,
        },
      });

      const courier = await prisma.courier.findUnique({
        where: {
          id: +courierId,
        },
      });

      const dPrice = courier.price - checkout.couriers.price;

      if (!checkout) {
        throw new NotFoundError('No Checkout found', `There is no checkout with id ${id}`);
      }

      checkout = await prisma.checkout.update({
        where: {
          id: +id,
        },
        data: {
          totalPrice: {
            increment: dPrice,
          },
          method,
          address,
          courierId,
        },
      });

      return checkout;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Failed to update checkout', e);
      } else {
        throw e;
      }
    }
  }

  static async confirmPayment(id) {
    try {
      let checkout = await prisma.checkout.findFirst({
        where: {
          id: +id,
        },
      });

      if (!checkout) {
        throw new NotFoundError('No Checkout found', `There is no checkout with id ${id}`);
      }

      checkout = await prisma.checkout.update({
        where: {
          id: +id,
        },
        data: {
          status: checkoutStatus.PACKING,
        },
      });

      return checkout;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Failed to update checkout', e);
      } else {
        throw e;
      }
    }
  }

  static async remove(id) {
    try {
      const checkout = await prisma.checkout.findFirst({
        where: {
          id: +id,
        },
      });

      if (!checkout) {
        throw new NotFoundError('No Checkout found', `There is no checkout with id ${id}`);
      }

      await prisma.checkout.delete({
        where: {
          id: +id,
        },
      });

      return { message: 'Checkout deleted successfully' };
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Failed to delete checkout', e);
      } else {
        throw e;
      }
    }
  }

  static async action({ cartId, courierId, address, method }) {
    try {
      const cart = await prisma.cart.findUnique({
        where: {
          id: cartId,
        },
      });

      if (!cart) {
        throw new NotFoundError('No Cart Found', `There is no cart with id ${cartId}`);
      }

      if (cart.totalPrice == 0) {
        throw new ConflictError('Cart empty!!', 'There is no item in the cart');
      }

      const count = await prisma.$transaction(async (tx) => {
        // --- check courier --- //
        const courier = await tx.courier.findUnique({
          where: {
            id: +courierId,
          },
        });

        // --- buat record di checkout
        const checkout = await tx.checkout.create({
          data: {
            status: checkoutStatus.WAIT_FOR_PAYMENT,
            totalPrice: cart.totalPrice + courier.price,
            totalProductPrice: cart.totalPrice,
            userId: cart.userId,
            address,
            courierId,
            method,
          },
        });

        // ---- ambil data dari product cart
        const productCart = await tx.productCart.findMany({
          where: {
            cartId,
          },
        });
        // --- tulis data ke productCheckout
        let data = [];
        productCart.forEach((item) => {
          data.push({
            checkoutId: checkout.id,
            productId: item.productId,
            quantityItem: item.quantityItem,
            productPrice: item.productPrice,
          });
        });

        await tx.productCheckout.createMany({
          data,
        });

        // --- kosongkan table productCart
        await tx.productCart.deleteMany({
          where: {
            cartId,
          },
        });

        // const productCheckout = tx.productCheckout.findMany({
        //   where: {
        //     checkoutId: checkout.id,
        //   },
        // });
        return checkout;
      });

      return count;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Failed to perform checkout', e.message);
      } else {
        throw e;
      }
    }
  }

  static async send({ checkoutId, warehouseSelections }) {
    try {
      if (warehouseSelections.length === 0)
        throw new BadRequest('Empty Warehouse Selection', 'Warehouse Selection cannot be empty');
      await prisma.$transaction(async (tx) => {
        // --- update warehouse pilihan untuk setiap produk yang dipilih
        for (const w of warehouseSelections) {
          await tx.productCheckout.update({
            where: {
              productId_checkoutId: {
                checkoutId: +checkoutId,
                productId: +w.productId,
              },
            },
            data: {
              warehouseId: w.warehouseId,
            },
          });
        }

        // --- ubah status dan tambah nomor resi
        const resi = `${+new Date()}`;
        const checkout = await tx.checkout.update({
          where: {
            id: +checkoutId,
          },
          data: {
            status: checkoutStatus.SENT,
            resi,
          },
          include: {
            user: true,
            productCheckout: {
              include: {
                product: {
                  select: {
                    name: true,
                  },
                },
                warehouse: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        });

        emailSendOrderInfoToUser(checkout);

        //--- ambil produk yang di checkout
        const productCheckouts = await tx.productCheckout.findMany({
          where: {
            checkoutId: +checkoutId,
          },
        });

        // --- update masing-masing barang yang ada di checkout list
        for (const i of productCheckouts) {
          // --- kurangi quantity dari tabel produk
          await tx.product.update({
            where: {
              id: i.productId,
            },
            data: {
              totalStock: {
                decrement: i.quantityItem,
              },
            },
          });

          // --- kurangi quantity dari tabel productWarehouse
          await tx.productWarehouse.update({
            where: {
              productId_warehouseId: {
                warehouseId: i.warehouseId,
                productId: i.productId,
              },
            },
            data: {
              quantity: {
                decrement: i.quantityItem,
              },
            },
          });

          // ---- kurangi quantity dari tabel batch
          await this.#takeFromBatches(i.productId, i.warehouseId, i.quantityItem, tx);
        }
      }); // end transaction
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Failed to send checkout', e.message);
      } else {
        throw e;
      }
    }
  }

  static async feedback({ checkoutId, feedback }) {
    try {
      await prisma.checkout.update({
        where: {
          id: checkoutId,
        },
        data: {
          status: feedback,
        },
      });
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Failed to set feedback checkout', e.message);
      } else {
        throw e;
      }
    }
  }

  static async getUserCheckouts(userId) {
    try {
      const checkouts = await prisma.checkout.findMany({
        where: {
          userId,
        },
        include: {
          productCheckout: {
            include: {
              product: true,
            },
          },
          couriers: true,
        },
      });

      return checkouts;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Failed to get user checkouts', e.message);
      } else {
        throw e;
      }
    }
  }

  static async getUserDetailCheckout(userId, checkoutId) {
    try {
      const checkout = await prisma.checkout.findFirst({
        where: {
          id: checkoutId,
          userId,
        },
        include: {
          productCheckout: {
            include: {
              product: true,
            },
          },
          couriers: true,
        },
      });

      return checkout;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Failed to get checkout detail', e.message);
      } else {
        throw e;
      }
    }
  }

  static async addProduct(id, payload) {
    try {
      const checkout = await prisma.checkout.findUnique({
        where: {
          id: +id,
        },
      });

      if (!checkout)
        throw new NotFoundError('No Checkout Found', `Can't find Checkout with id ${id}`);

      const product = await prisma.product.findUnique({
        where: {
          id: +payload.productId,
        },
      });

      const productCheckout = await prisma.$transaction(async (tx) => {
        const productCheckout = await tx.productCheckout.upsert({
          where: {
            productId_checkoutId: {
              productId: +payload.productId,
              checkoutId: +payload.checkoutId,
            },
          },
          update: {
            quantityItem: {
              increment: +payload.quantity,
            },
            productPrice: {
              increment: +payload.quantity * product.price,
            },
          },
          create: {
            productId: +payload.productId,
            checkoutId: +payload.checkoutId,
            quantityItem: +payload.quantity,
            productPrice: +payload.quantity * product.price,
          },
        });

        await tx.checkout.update({
          where: {
            id: +id,
          },
          data: {
            totalPrice: {
              increment: +payload.quantity * product.price,
            },
          },
        });

        return productCheckout;
      });

      return productCheckout;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Failed to add product to checkout', e.message);
      } else {
        throw e;
      }
    }
  }

  static async editProduct(payload) {
    try {
      const checkout = await prisma.checkout.findUnique({
        where: {
          id: +payload.checkoutId,
        },
      });

      if (!checkout)
        throw new NotFoundError(
          'No Checkout Found',
          `Can't find Checkout with id ${payload.checkoutId}`,
        );

      const product = await prisma.product.findUnique({
        where: {
          id: +payload.productId,
        },
      });

      if (!product)
        throw new NotFoundError(
          'No Product Found',
          `Can't find Product with id ${payload.productId}`,
        );

      const productCheckout = await prisma.$transaction(async (tx) => {
        let productCheckout = await tx.productCheckout.findUnique({
          where: {
            productId_checkoutId: {
              productId: +payload.productId,
              checkoutId: +payload.checkoutId,
            },
          },
        });

        // update checkout data dlu buat pricenya
        await tx.checkout.update({
          where: {
            id: +payload.checkoutId,
          },
          data: {
            totalPrice: {
              increment: (+payload.quantity - productCheckout.quantityItem) * product.price,
            },
          },
        });

        productCheckout = await tx.productCheckout.update({
          where: {
            productId_checkoutId: {
              productId: +payload.productId,
              checkoutId: +payload.checkoutId,
            },
          },
          data: {
            quantityItem: +payload.quantity,
            productPrice: +payload.quantity * product.price,
          },
        });
        return productCheckout;
      });

      return productCheckout;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Failed update product checkout', e.message);
      } else {
        throw e;
      }
    }
  }

  static async deleteProduct(payload) {
    try {
      const checkout = await prisma.checkout.findUnique({
        where: {
          id: +payload.checkoutId,
        },
      });

      if (!checkout)
        throw new NotFoundError(
          'No Checkout Found',
          `Can't find Checkout with id ${payload.checkoutId}`,
        );

      let productCheckout = await prisma.productCheckout.findUnique({
        where: {
          productId_checkoutId: {
            productId: +payload.productId,
            checkoutId: +payload.checkoutId,
          },
        },
      });

      if (!productCheckout)
        throw new NotFoundError(
          'Product not found',
          `There is no product with id ${payload.productId} on checkout Id ${payload.checkoutId}`,
        );

      await prisma.$transaction(async (tx) => {
        productCheckout = await tx.productCheckout.delete({
          where: {
            productId_checkoutId: {
              productId: +payload.productId,
              checkoutId: +payload.checkoutId,
            },
          },
        });

        await tx.checkout.update({
          where: {
            id: +payload.checkoutId,
          },
          data: {
            totalPrice: {
              decrement: productCheckout.productPrice,
            },
          },
        });
      });

      return productCheckout;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Failed to add product to checkout', e.message);
      } else {
        throw e;
      }
    }
  }
}

module.exports = CheckoutService;
