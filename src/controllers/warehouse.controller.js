const WarehouseService = require('@services/warehouse.service');

class WarehouseController {
  static async getAllWarehouses(req, res, next) {
    try {
      const warehouses = await WarehouseService.getAllWarehouses();
      res.status(200).json(warehouses);
    } catch (e) {
      next(e);
    }
  }

  static async getWarehouseDetail(req, res, next) {
    try {
      const { id } = req.params;
      const warehouse = await WarehouseService.getWarehouseDetail(id);
      res.status(200).json(warehouse);
    } catch (e) {
      next(e);
    }
  }

  static async addWarehouse(req, res, next) {
    try {
      const { name, address, city } = req.body;
      await WarehouseService.addWarehouse(name, address, city);
      res.status(201).json({ message: 'Added a new warehouse successfully!' });
    } catch (e) {
      next(e);
    }
  }

  static async editWarehouse(req, res, next) {
    try {
      const { id } = req.params;
      const { name, address, city } = req.body;
      const updatedWarehouse = await WarehouseService.editWarehouse(id, name, address, city);
      res
        .status(200)
        .json({ message: 'Warehouse Data Updated Successfully!', data: updatedWarehouse });
    } catch (e) {
      next(e);
    }
  }

  static async deleteWarehouse(req, res, next) {
    try {
      const { id } = req.params;
      await WarehouseService.deleteWarehouse(id);
      res.status(200).json({ message: 'Warehouse Deleted Successfully!' });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = WarehouseController;
