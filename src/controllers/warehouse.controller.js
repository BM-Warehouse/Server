const WarehouseService = require('@services/warehouse.service');
const { BadRequest } = require('@src/exceptions/error.excecptions');
const { getPaginationStatus } = require('@src/libs/pagination');
const { successResponse } = require('@src/responses/responses');

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

class WarehouseController {
  // static async getAllWarehouses(req, res, next) {
  //   try {
  //     let { page, limit } = req.query;

  //     page = +page || DEFAULT_PAGE;
  //     limit = +limit || DEFAULT_LIMIT;

  //     const warehouses = await WarehouseService.getAllWarehouses({
  //       page,
  //       limit,
  //     });

  //     const pagination = getPaginationStatus(page, limit, warehouses.count);

  //     // res.status(200).json({ message: 'ok', warehouses, pagination });
  //     res
  //       .status(200)
  //       .json(
  //         successResponse({ warehouses, pagination }, 'All warehouses data successfully retrieved'),
  //       );
  //   } catch (e) {
  //     next(e);
  //   }
  // }

  static async getAllWarehouses(req, res, next) {
    try {
      let { page, limit } = req.query;

      page = +page || DEFAULT_PAGE;
      limit = +limit || DEFAULT_LIMIT;

      const warehouses = await WarehouseService.getAllWarehouses({ page, limit });

      const pagination = getPaginationStatus(page, limit, warehouses.count);

      res
        .status(200)
        .json(
          successResponse({ warehouses, pagination }, 'All warehouses data successfully retrieved'),
        );
    } catch (e) {
      next(e);
    }
  }

  // warehouse.controller.js

  static async getBatch(req, res, next) {
    try {
      const { productId, warehouseId, page = 1, limit = 10 } = req.query;

      if (!productId || !warehouseId) {
        throw new BadRequest('Parameter Error', 'productId and warehouseId must be supplied');
      }

      const filter = {
        page: +page,
        limit: +limit,
      };

      const payload = {
        productId: +productId,
        warehouseId: +warehouseId,
      };

      const batches = await WarehouseService.getBatch(payload, filter);

      const pagination = getPaginationStatus(page, limit, batches.count);

      res
        .status(200)
        .json(
          successResponse({ batches, pagination }, 'All warehouses data successfully retrieved'),
        );
    } catch (e) {
      next(e);
    }
  }

  static async getWarehouseDetail(req, res, next) {
    try {
      let { page, limit } = req.query;

      page = +page || DEFAULT_PAGE;
      limit = +limit || DEFAULT_LIMIT;

      const filter = {
        page,
        limit,
      };

      const { id } = req.params;

      const warehouse = await WarehouseService.getWarehouseDetail(id, filter);
      const pagination = getPaginationStatus(page, limit, warehouse.count);
      // res.status(200).json(warehouse);
      res
        .status(200)
        .json(successResponse({ warehouse, pagination }, 'Warehouse data successfully retrieved'));
    } catch (e) {
      next(e);
    }
  }

  static async addWarehouse(req, res, next) {
    try {
      const { name, address, city } = req.body;
      await WarehouseService.addWarehouse(name, address, city);
      // res.status(201).json({ data: req.body, message: 'Added a new warehouse successfully!' });
      res
        .status(201)
        .json(successResponse({ data: req.body }, 'Added a new warehouse successfully!'));
    } catch (e) {
      next(e);
    }
  }

  static async editWarehouse(req, res, next) {
    try {
      const { id } = req.params;
      const { name, address, city } = req.body;
      const updatedWarehouse = await WarehouseService.editWarehouse(id, name, address, city);
      res.status(200);
      // .json({ message: 'Warehouse Data Updated Successfully!', data: updatedWarehouse });
      res
        .status(200)
        .json(successResponse({ updatedWarehouse }, 'Warehouse Data Updated Successfully!'));
    } catch (e) {
      next(e);
    }
  }

  static async deleteWarehouse(req, res, next) {
    try {
      const { id } = req.params;
      await WarehouseService.deleteWarehouse(id);
      // res.status(200).json({ message: 'Warehouse Deleted Successfully!' });
      res.status(200).json(successResponse('Warehouse Deleted Successfully!'));
    } catch (e) {
      next(e);
    }
  }

  static async getAllWarehouseQuantities(req, res, next) {
    try {
      const warehouse = await WarehouseService.productsWarehouse();
      res.status(200).json(warehouse);
    } catch (e) {
      next(e);
    }
  }
}
module.exports = WarehouseController;
