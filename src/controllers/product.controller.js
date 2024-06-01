const ProductService = require('@services/product.service');
const { BadRequest } = require('@exceptions/error.excecptions');
const { successResponse } = require('@responses/responses');
const { getPaginationStatus } = require('@src/libs/pagination');

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

class ProductController {
  static async getAll(req, res, next) {
    try {
      let { page, limit } = req.query;

      if ((page && isNaN(page)) || (limit && isNaN(limit))) {
        throw new BadRequest('Query parameter error', 'limit and page have to be a number');
      }

      page = +page || DEFAULT_PAGE;
      limit = +limit || DEFAULT_LIMIT;

      req.query = {
        ...req.query,
        page,
        limit,
      };

      const { products, count } = await ProductService.getAll(req.query);
      const pagination = getPaginationStatus(page, limit, count);
      res.status(200).json(successResponse({ products, pagination }, 'ok'));
    } catch (e) {
      next(e);
    }
  }

  static async getDetail(req, res, next) {
    try {
      const id = req.params.id;
      const product = await ProductService.getDetail(id);
      res.status(200).json(successResponse({ product }, 'Products retrieved successfully'));
    } catch (e) {
      next(e);
    }
  }

  static async add(req, res, next) {
    try {
      const product = await ProductService.add(req.body);
      res.status(200).json(successResponse({ product }, 'Products added successfully'));
    } catch (e) {
      next(e);
    }
  }

  static async edit(req, res, next) {
    try {
      const product = await ProductService.edit(req.body);
      res.status(200).json(successResponse({ product }, 'Products edited successfully!'));
    } catch (e) {
      next(e);
    }
  }

  static async delete(req, res, next) {
    try {
      const product = await ProductService.delete(req.params.id);
      res.status(200).json(successResponse({ product }, 'Products deleted successfully!'));
    } catch (e) {
      next(e);
    }
  }

  static async addToWarehouse(req, res, next) {
    try {
      const product = await ProductService.addToWarehouse(req.body);
      res
        .status(200)
        .json(successResponse({ product }, 'Product added to warehouse successfully!'));
    } catch (e) {
      next(e);
    }
  }

  static async moveWarehouse(req, res, next) {
    try {
      const product = await ProductService.moveWarehouse(req.body);
      res
        .status(200)
        .json(successResponse({ product }, 'Product(s) has/have been moved successfully!'));
    } catch (e) {
      next(e);
    }
  }

  static async getExpired(req, res, next) {
    try {
      let { page, limit } = req.query;

      if ((page && isNaN(page)) || (limit && isNaN(limit))) {
        throw new BadRequest('Query parameter error', 'limit and page have to be a number');
      }

      page = +page || DEFAULT_PAGE;
      limit = +limit || DEFAULT_LIMIT;

      let filter = {
        ...req.query,
        page,
        limit,
      };

      const batches = await ProductService.getExpired(filter);

      res.status(200).json(successResponse({ batches }, 'Successfully retieve data from batch'));
    } catch (e) {
      next(e);
    }
  }

  static async damage(req, res, next) {
    try {
      if (!req.body.productId || !req.body.warehouseId || !req.body.quantity) {
        throw new BadRequest(
          'Damage Report parameter Error',
          'productId, warehouseId, and quantity must be supplied',
        );
      }

      if (isNaN(req.body.productId) || isNaN(req.body.warehouseId) || isNaN(req.body.quantity)) {
        throw new BadRequest(
          'Damage Report parameter Error',
          'productId, warehouseId, and quantity must be a number',
        );
      }

      const payload = {
        productId: +req.body.productId,
        warehouseId: +req.body.warehouseId,
        quantity: +req.body.quantity,
      };

      const batches = await ProductService.damage(payload);
      res.status(200).json(successResponse({ batches }, 'Successfully retieve data from batch'));
    } catch (e) {
      next(e);
    }
  }

  static async deleteProductWarehouse(req, res, next) {
    try {
      const { warehouseId, productId } = req.params;

      if (isNaN(warehouseId) || isNaN(productId)) {
        throw new BadRequest('Parameter Error', 'warehouseId and productId must be numbers');
      }

      await ProductService.deleteProductFromWarehouse(+warehouseId, +productId);
      res.status(200).json(successResponse({}, 'Product successfully removed from warehouse'));
    } catch (e) {
      next(e);
    }
  }
}

module.exports = ProductController;
