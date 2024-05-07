const prisma = require('@libs/prisma');
const {
  InternalServerError,
  ClientError,
  NotFoundError,
  BadRequest,
  ConflictError,
} = require('@exceptions/error.excecptions');

class ProductService {
  static async getAll({ page, limit }) {
    try {
      const products = await prisma.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });

      return products;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Fail to delete Product to db', e);
      } else {
        throw e;
      }
    }
  }

  static async getDetail(id) {
    try {
      const products = await prisma.product.findFirst({
        where: {
          id: +id,
        },
        include: {
          productWarehouses: true,
          productCategories: true,
        },
      });

      if (!products) {
        throw new NotFoundError('No product found', `There is no product with id ${id}`);
      }

      return products;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Fail to get detail of product', e);
      } else {
        throw e;
      }
    }
  }

  static async add(payload) {
    try {
      const data = payload;
      if (!data.name || !data.price) {
        throw new BadRequest('Invalid body parameter', 'name and price cannot be empty!');
      }

      let product = await prisma.product.findFirst({
        where: {
          name: data.name,
        },
      });

      if (product) {
        throw new ConflictError(
          'Data conflict of product',
          `The product with name '${data.name}' has been available!`,
        );
      }

      product = await prisma.product.create({
        data,
      });
      return product;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Fail to add product list to db', e);
      } else {
        throw e;
      }
    }
  }

  static async edit(payload) {
    try {
      const { id, name, description, totalStock, price, imageUrl } = payload;

      let product = await this.getDetail(id);
      if (!product) {
        throw new NotFoundError('No product found', `There is no product with id ${id}`);
      }

      product = await prisma.product.update({
        data: {
          name,
          description,
          totalStock,
          price,
          imageUrl,
        },
        where: {
          id: +id,
        },
      });
      return product;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Fail to delete Product to db', e);
      } else {
        throw e;
      }
    }
  }

  static async delete(id) {
    try {
      let product = await this.getDetail(id);
      if (!product) {
        throw new NotFoundError('No product found', `There is no product with id ${id}`);
      }

      product = await prisma.product.delete({
        where: {
          id: +id,
        },
      });
      return product;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Fail to delete Product to db', e);
      } else {
        throw e;
      }
    }
  }

  static async addToWarehouse(payload) {
    let transaction = null;
    try {
      // ------- validasi request ----------- //
      // if (!payload.warehouseId || !payload.productId || !payload.quantity) {
      //   throw new BadRequest('Invalid body parameter',
      //    'warehouseId, productId, or quantity cannot be empty!');
      // }

      // const product = await prisma.product.findFirst({
      //   where: {
      //     id: payload.productId,
      //   },
      // });

      // const warehouse = await prisma.warehouse.findFirst({
      //   where: {
      //     id: payload.warehouseId
      //   }
      // })

      // if (!product) {
      //   throw new NotFoundError(
      //     'No Product Found',
      //     `The product with id '${payload.productId}' is not available`,
      //   );
      // }

      // if (!warehouse) {
      //   throw new NotFoundError(
      //     'No warehouse Found',
      //     `The warehouse with id '${payload.warehouse}' is not available`,
      //   );
      // }

      // -------------- proses --------------- //
      console.log('addToWarehouse', payload);
      // transaction = await prisma.productWarehouse({
      //   where:{
      //     warehouseId: payload.warehouseId,
      //     productId: payload.productId
      //   },
      //   // update: {},
      //   create: {
      //     warehouseId: payload.warehouseId,
      //     productId: payload.productId,
      //     quantity: 0
      //   }
      // })

      const product = await prisma.product.findFirst({
        where: {
          name: payload.productName,
        },
        select: {
          id: true,
        },
      });

      try {
        transaction = await prisma.product.upsert({
          where: {
            name: payload.productName,
          },
          update: {
            productWarehouses: {
              update: {
                data: {
                  quantity: {
                    increment: +payload.quantity,
                  },
                  warehouse: {
                    connectOrCreate: {
                      where: {
                        name: payload.warehouseName,
                      },
                      create: {
                        name: payload.warehouseName,
                      },
                    },
                  },
                },
                where: {
                  productId_warehouseId: {
                    productId: product.id,
                    warehouseId: product.id,
                  },
                },
              },
            },
          },
          create: {
            name: payload.productName,
            price: 332211,
            productWarehouses: {
              create: {
                quantity: 112233,
                warehouse: {
                  connectOrCreate: {
                    where: {
                      name: payload.warehouseName,
                    },
                    create: {
                      name: payload.warehouseName,
                    },
                  },
                },
              },
            },
          },
        });

        console.log(transaction);
      } catch (e) {
        console.log(e);
      }

      // try{
      //   transaction = await prisma.product.upsert({
      //     where:{
      //       name: "test"
      //     },
      //     update: {
      //       description: "yyyyy",
      //       price: 1234
      //     },
      //     create: {
      //       name: "test",
      //       description: "xxxxx",
      //       price:4321
      //     }
      //   })
      // } catch (e) {
      //   console.log(e)
      //   throw e
      // }

      // await prisma.$transaction([
      //   //create or update productWarehouse table

      // ])

      // console.log(transaction);

      // return product;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Fail to add product to warehouse', e);
      } else {
        throw e;
      }
    }
  }
}

module.exports = ProductService;
