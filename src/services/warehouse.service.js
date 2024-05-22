const { NotFoundError } = require('@src/exceptions/error.excecptions');
const prisma = require('@src/libs/prisma');

class WarehouseService {
  // static async getAllWarehouses({ page, limit }) {
  //   try {
  //     const warehouses = await prisma.warehouse.findMany({
  //       skip: (page - 1) * limit,
  //       take: limit,
  //     });
  //     const count = await prisma.warehouse.count();
  //     return { warehouses, count };
  //   } catch (e) {
  //     throw new e();
  //   }
  // }

  static async getAllWarehouses({ page, limit }) {
    try {
      const warehouses = await prisma.warehouse.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: {
          productsWarehouses: {
            select: {
              quantity: true,
              product: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          // batches: {
          //   select: {
          //     id: true,
          //     batchName: true,
          //     stock: true,
          //     expireDate: true,
          //   },
          // },
          // outgoingRecord: {
          //   select: {
          //     id: true,
          //     status: true,
          //     quantity: true,
          //     product: {
          //       select: {
          //         id: true,
          //         name: true,
          //       },
          //     },
          //   },
          // },
          // productCheckouts: {
          //   select: {
          //     quantityItem: true,
          //     productPrice: true,
          //     product: {
          //       select: {
          //         id: true,
          //         name: true,
          //       },
          //     },
          //     checkout: {
          //       select: {
          //         id: true, // if needed, otherwise remove
          //         status: true,
          //       },
          //     },
          //   },
          // },
        },
      });

      const count = await prisma.warehouse.count();

      return { warehouses, count };
    } catch (e) {
      throw new Error('Failed to retrieve warehouses');
    }
  }

  static async getWarehouseDetail(id) {
    try {
      const warehouse = await prisma.warehouse.findMany({
        where: {
          id: +id,
        },
        include: {
          productsWarehouses: {
            select: {
              quantity: true,
              product: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!warehouse) {
        throw new NotFoundError('Cannot find warehouse with that ID!');
      }
      return warehouse;
    } catch (e) {
      throw new e();
    }
  }

  static async addWarehouse(name, address, city) {
    try {
      const newWarehouse = await prisma.warehouse.create({
        data: {
          name,
          address,
          city,
        },
      });

      return newWarehouse;
    } catch (e) {
      throw new e();
    }
  }

  static async editWarehouse(id, name, address, city) {
    try {
      const updatedWarehouse = await prisma.warehouse.update({
        where: {
          id: +id,
        },
        data: {
          name,
          address,
          city,
        },
      });

      return updatedWarehouse;
    } catch (e) {
      throw new e();
    }
  }

  static async deleteWarehouse(id) {
    try {
      await prisma.warehouse.delete({
        where: {
          id: +id,
        },
      });
    } catch (e) {
      throw new e();
    }
  }

  static async productsWarehouse() {
    try {
      const quantityWarehouse = await prisma.productWarehouse.groupBy({
        by: ['warehouseId'],
        _sum: {
          quantity: true,
        },
      });

      return quantityWarehouse.map((warehouse) => ({
        warehouseId: warehouse.warehouseId,
        totalQuantity: warehouse._sum.quantity,
      }));
    } catch (e) {
      throw new e();
    }
  }
}

module.exports = WarehouseService;
