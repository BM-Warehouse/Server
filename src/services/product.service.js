const prisma = require('@libs/prisma');
const {
  InternalServerError,
  ClientError,
  NotFoundError,
  BadRequest,
  ConflictError,
} = require('@exceptions/error.excecptions');

const MAXIMUM_MONTH_BATCH = 3;

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
        data: {
          ...data,
          totalStock: 0,
        },
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

        const expireDate = await this.#generateExpireDateAfter(MAXIMUM_MONTH_BATCH);
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
        throw new InternalServerError('Fail to add product to warehouse', e);
      } else {
        throw e;
      }
    }
  }

  static async #takeFromBatches(product, warehouse, quantityToTake, tx) {
    let stillNeedToTake = quantityToTake;
    let ret = [];
    //list semua batch
    let batches = await tx.batch.findMany({
      where: {
        productId: product.id,
        warehouseId: warehouse.id,
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
        `Can't find any batch for product '${product.id}' that still has stock available`,
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
        return ret;
      }
    }

    // harusnya g pernah reach sini, klo sampek sini berarti ada kesalahan data
    throw new ConflictError(
      'Batches stock empty!!',
      'There are still item to be taken from batches',
    );
  }

  static async moveWarehouse(payload) {
    try {
      let product = null;
      let warehouseSource = null;
      let warehouseDestination = null;
      const {
        productName,
        warehouse: { from, to },
        quantity,
      } = payload;
      // ------ validation ---------- //
      if (!productName || !to || !from) {
        throw new BadRequest(
          'Invalid body parameter',
          'productName, warehouse.to, or warehouse.from cannot be empty!',
        );
      }

      product = await prisma.product.findFirst({
        where: {
          name: productName,
        },
      });

      if (product.totalStock < quantity) {
        throw new ConflictError(
          'No enough stock',
          'The quantity of product to be moved is larger than the stock of product available',
        );
      }

      warehouseSource = await prisma.warehouse.findFirst({
        where: {
          name: from,
        },
      });

      warehouseDestination = await prisma.warehouse.findFirst({
        where: {
          name: to,
        },
      });

      if (!warehouseSource) {
        throw new NotFoundError('Warehouse source is not found');
      }

      if (!warehouseDestination) {
        throw new NotFoundError('Warehouse destination is not found');
      }

      // -------- proses --------- //
      await prisma.$transaction(async (tx) => {
        //ambil kurangi quantity dari batch
        await this.#takeFromBatches(product, warehouseSource, quantity, tx);

        // tambah batch buat barang masuk di warehouse tujuan
        const expireDate = await this.#generateExpireDateAfter(MAXIMUM_MONTH_BATCH);
        const batchName = `${product.name}_${warehouseDestination.name}_${+new Date()}`;
        await tx.batch.create({
          data: {
            batchName,
            productId: product.id,
            warehouseId: warehouseDestination.id,
            stock: quantity,
            expireDate,
          },
        });

        // tambah quantity warehouse destination
        await tx.productWarehouse.upsert({
          where: {
            productId_warehouseId: {
              productId: product.id,
              warehouseId: warehouseDestination.id,
            },
          },
          update: {
            quantity: {
              increment: +quantity,
            },
          },
          create: {
            productId: product.id,
            warehouseId: warehouseDestination.id,
            quantity: +quantity,
          },
        });

        //kurangi quantity warehouse source
        await tx.productWarehouse.update({
          where: {
            productId_warehouseId: {
              productId: product.id,
              warehouseId: warehouseSource.id,
            },
          },
          data: {
            quantity: {
              decrement: +quantity,
            },
          },
        });
      });
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
