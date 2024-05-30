const prisma = require('@libs/prisma');
const { getExpiredProduct } = require('@libs/expiredChecker');
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

  static async getAll(payload) {
    const { page, limit, categoryId, warehouseId, minPrice, maxPrice, contains } = payload;
    let where = { price: {} };

    if (contains) {
      where.name = {
        contains,
        mode: 'insensitive',
      };
    }
    if (categoryId) {
      where.productCategories = {
        some: {
          categoryId: +categoryId,
        },
      };
    }
    if (warehouseId) {
      where.productWarehouses = {
        some: {
          warehouseId: +warehouseId,
        },
      };
    }
    if (maxPrice) {
      where.price = {
        ...where.price,
        lte: +maxPrice,
      };
    }
    if (minPrice) {
      where.price = {
        ...where.price,
        gte: +minPrice,
      };
    }

    try {
      const products = await prisma.product.findMany({
        where,
        include: {
          productCategories: {
            select: {
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          productWarehouses: {
            select: {
              quantity: true,
              warehouse: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      const count = await prisma.product.count({
        where,
      });

      return { products, count };
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Fail to get product', e.message);
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
          productWarehouses: {
            include: {
              warehouse: true,
            },
          },
          productCategories: {
            select: {
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!products) {
        throw new NotFoundError('No product found', `There is no product with id ${id}`);
      }

      return products;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Fail to get detail of product', e.message);
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
        throw new InternalServerError('Fail to add product list to db', e.message);
      } else {
        throw e;
      }
    }
  }

  static async edit(payload) {
    try {
      const { id, name, description, price, imageUrl } = payload;

      // ------ validation ----- //
      let product = await prisma.product.findFirst({
        where: {
          name,
          NOT: {
            id,
          },
        },
      });

      if (product) {
        throw new ConflictError(
          'Product name exist already',
          `There is a product with name '${name}'`,
        );
      }

      product = await this.getDetail(id);
      if (!product) {
        throw new NotFoundError('No product found', `There is no product with id ${id}`);
      }

      product = await prisma.product.update({
        data: {
          name,
          description,
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
        throw new InternalServerError('Fail to edit Product to db', e.message);
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
        throw new InternalServerError('Fail to delete Product to db', e.message);
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

  static async addToWarehouse(payload) {
    let { warehouseId, productId, quantity } = payload;
    if (quantity) quantity = +quantity;
    try {
      // ------- validasi request ----------- //
      if (!warehouseId || !productId || !quantity) {
        throw new BadRequest(
          'Invalid body parameter',
          'warehouseId, productId, or quantity cannot be empty!',
        );
      }
      const product = await prisma.product.findFirst({
        where: {
          id: +productId,
        },
      });

      const warehouse = await prisma.warehouse.findFirst({
        where: {
          id: +warehouseId,
        },
      });

      if (!product) {
        throw new NotFoundError(
          'No Product Found',
          `The product with id '${productId}' is not available`,
        );
      }

      if (!warehouse) {
        throw new NotFoundError(
          'No warehouse Found',
          `The warehouse with id '${warehouseId}' is not available`,
        );
      }

      // -------------- proses --------------- //
      await prisma.$transaction(async (tx) => {
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
        throw new InternalServerError('Fail to add product to warehouse', e.message);
      } else {
        throw e;
      }
    }
  }

  static async moveWarehouse(payload) {
    try {
      let product = null;
      let warehouseSource = null;
      let warehouseDestination = null;

      const productId = +payload.productId;
      const quantity = +payload.quantity;
      const from = +payload.warehouseId.from;
      const to = +payload.warehouseId.to;

      // ------ validation ---------- //
      if (!productId || !to || !from) {
        throw new BadRequest(
          'Invalid body parameter',
          'productId, warehouse.to, or warehouse.from cannot be empty!',
        );
      }

      product = await prisma.product.findFirst({
        where: {
          id: productId,
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
          id: from,
        },
      });

      warehouseDestination = await prisma.warehouse.findFirst({
        where: {
          id: to,
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
        const pw = await tx.productWarehouse.update({
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

        // hapus kalo quantitynya 0
        if (pw.quantity == 0) {
          await tx.productWarehouse.delete({
            where: {
              productId_warehouseId: {
                productId: product.id,
                warehouseId: warehouseSource.id,
              },
            },
          });
        }

        // buat record di outgoing record
        await tx.outgoingRecord.create({
          data: {
            quantity: +quantity,
            status: 'Move to Another Warehouse',
            productId: product.id,
            warehouseId: warehouseSource.id,
          },
        });
      });
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Fail to add product to warehouse', e.message);
      } else {
        throw e;
      }
    }
  }

  static async getExpired(filter) {
    try {
      const batches = await getExpiredProduct(filter);
      return batches;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Fail to get expired product', e.message);
      } else {
        throw e;
      }
    }
  }

  static async damage({ productId, warehouseId, quantity }) {
    try {
      // ------ validation ---------- //
      const product = await prisma.product.findFirst({
        where: {
          id: productId,
        },
      });

      if (!product) {
        throw new NotFoundError('Product is not found', `No Product with id ${productId}`);
      }

      const warehouse = await prisma.warehouse.findFirst({
        where: {
          id: warehouseId,
        },
      });

      if (!warehouse) {
        throw new NotFoundError('warehouse is not found', `No warehouse with id ${warehouseId}`);
      }

      // ---------- Proses --------- //
      await prisma.$transaction(async (tx) => {
        //ambil kurangi quantity dari batch
        await this.#takeFromBatches(product, warehouse, quantity, tx);

        //kurangi quantity di warehouse
        const pw = await tx.productWarehouse.update({
          where: {
            productId_warehouseId: {
              productId: product.id,
              warehouseId: warehouse.id,
            },
          },
          data: {
            quantity: {
              decrement: quantity,
            },
          },
        });

        // hapus kalo quantitynya 0
        if (pw.quantity == 0) {
          await tx.productWarehouse.delete({
            where: {
              productId_warehouseId: {
                productId: product.id,
                warehouseId: warehouse.id,
              },
            },
          });
        }

        // kurangi quantity di product
        await tx.product.update({
          where: {
            id: product.id,
          },
          data: {
            totalStock: {
              decrement: quantity,
            },
          },
        });

        // buat record di outgoing record
        await tx.outgoingRecord.create({
          data: {
            quantity: +quantity,
            status: 'Damage',
            productId: product.id,
            warehouseId: warehouse.id,
          },
        });
      });
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Fail to add product to warehouse', e.message);
      } else {
        throw e;
      }
    }
  }
}

module.exports = ProductService;
