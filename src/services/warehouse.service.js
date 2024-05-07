const prisma = require('@src/libs/prisma');

class WarehouseService {
  static async getAllWarehouses({ page, limit }) {
    try {
      const warehouses = await prisma.warehouse.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });
      return warehouses;
    } catch (e) {
      throw new e();
    }
  }

  static async getWarehouseDetail(id) {
    try {
      const warehouse = await prisma.warehouse.findFirst({
        where: {
          id: +id,
        },
      });
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
}

module.exports = WarehouseService;
