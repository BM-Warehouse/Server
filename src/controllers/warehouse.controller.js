const WarehouseService = require('@services/warehouse.service');
const { getPaginationStatus } = require('@src/libs/pagination');
const { successResponse } = require('@src/responses/responses');

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

class WarehouseController {
  static async getAllWarehouses(req, res, next) {
    try {
      let { page, limit } = req.query;

      page = +page || DEFAULT_PAGE;
      limit = +limit || DEFAULT_LIMIT;

      const warehouses = await WarehouseService.getAllWarehouses({
        page,
        limit,
      });

      const pagination = getPaginationStatus(page, limit, warehouses.count);

      // res.status(200).json({ message: 'ok', warehouses, pagination });
      res
        .status(200)
        .json(
          successResponse({ warehouses, pagination }, 'All warehouses data successfully retrieved'),
        );
    } catch (e) {
      next(e);
    }
  }

  static async getWarehouseDetail(req, res, next) {
    try {
      const { id } = req.params;
      const warehouse = await WarehouseService.getWarehouseDetail(id);
      // res.status(200).json(warehouse);
      res.status(200).json(successResponse({ warehouse }, 'Warehouse data successfully retrieved'));
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
}

module.exports = WarehouseController;
