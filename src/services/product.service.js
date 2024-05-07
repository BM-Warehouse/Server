const prisma = require('@libs/prisma');
const {
  InternalServerError,
  ClientError,
  NotFoundError,
  BadRequest,
  ConflictError,
} = require('@exceptions/error.excecptions');

class ProductService {
  static async #generateExpireDateAfter(month) {
    let expireDate = new Date();
    expireDate.setMonth(expireDate.getMonth() + month);

    return expireDate;
  }

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
    let { warehouseName, productName, quantity } = payload;
    if (quantity) quantity = +quantity;
    try {
      // ------- validasi request ----------- //
      if (!warehouseName || !productName || !quantity) {
        throw new BadRequest(
          'Invalid body parameter',
          'warehouseName, productName, or quantity cannot be empty!',
        );
      }
      const product = await prisma.product.findFirst({
        where: {
          name: productName,
        },
      });

      const warehouse = await prisma.warehouse.findFirst({
        where: {
          name: warehouseName,
        },
      });

      if (!product) {
        throw new NotFoundError(
          'No Product Found',
          `The product with name '${productName}' is not available`,
        );
      }

      if (!warehouse) {
        throw new NotFoundError(
          'No warehouse Found',
          `The warehouse with name '${warehouseName}' is not available`,
        );
      }

      // -------------- proses --------------- //
      prisma.$transaction(async (tx) => {
        await tx.productWarehouse.upsert({
          where: {
            productId_warehouseId: {
              productId: product.id,
              warehouseId: warehouse.id,
            },
          },
          update: {
            quantity: {
              increment: +payload.quantity,
            },
          },
          create: {
            productId: product.id,
            warehouseId: warehouse.id,
            quantity: +payload.quantity,
          },
        });

        const expireDate = await this.#generateExpireDateAfter(3);
        const batchName = `${product.name}_${warehouse.name}_${+new Date()}`;
        await tx.batch.create({
          data: {
            batchName,
            productId: product.id,
            warehouseId: warehouse.id,
            stock: quantity,
            expireDate,
          },
        });

        await tx.product.update({
          where: {
            id: product.id,
          },
          data: {
            totalStock: {
              increment: quantity,
            },
          },
        });
      });
    } catch (e) {
      if (!(e instanceof ClientError)) {
        console.log(e);
        throw new InternalServerError('Fail to add product to warehouse', e);
      } else {
        throw e;
      }
    }
  }
}

module.exports = ProductService;
