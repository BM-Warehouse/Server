const ProductService = require('@services/product.service');
const { BadRequest } = require('@exceptions/error.excecptions');
const { successResponse } = require('@responses/responses');

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

class ProductController {
  static async getAll(req, res, next) {
    try {
      let filter = req.query;

      if ((filter.page && isNaN(filter.page)) || (filter.limit && isNaN(filter.limit))) {
        throw new BadRequest('Query parameter error', 'limit and page have to be a number');
      }

      filter.page = +filter.page || DEFAULT_PAGE;
      filter.limit = +filter.limit || DEFAULT_LIMIT;

      const products = await ProductService.getAll(filter);
      res.status(200).json(successResponse({ products }, 'ok'));
    } catch (e) {
      next(e);
    }
  }

  static async getDetail(req, res, next) {
    try {
      const id = req.params.id;
      const product = await ProductService.getDetail(id);
      res.status(200).json(successResponse(product, 'Products retrieved successfully'));
    } catch (e) {
      next(e);
    }
  }

  static async add(req, res, next) {
    try {
      const product = await ProductService.add(req.body);
      res.status(200).json(successResponse(product, 'Products added successfully'));
    } catch (e) {
      next(e);
    }
  }

  static async edit(req, res, next) {
    try {
      const product = await ProductService.edit(req.body);
      res.status(200).json(successResponse(product, 'Products edited successfully!'));
    } catch (e) {
      next(e);
    }
  }

  static async delete(req, res, next) {
    try {
      const product = await ProductService.delete(req.params.id);
      res.status(200).json(successResponse(product, 'Products deleted successfully!'));
    } catch (e) {
      next(e);
    }
  }

  static async addToWarehouse(req, res, next) {
    try {
      const product = await ProductService.addToWarehouse(req.body);
      res.status(200).json(successResponse(product, 'Product added to warehouse successfully!'));
    } catch (e) {
      next(e);
    }
  }

  static async moveWarehouse(req, res, next) {
    try {
      const product = await ProductService.moveWarehouse(req.body);
      res
        .status(200)
        .json(successResponse(product, 'Product(s) has/have been moved successfully!'));
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

      res.status(200).json(successResponse(batches, 'Successfully retieve data from batch'));
    } catch (e) {
      next(e);
    }
  }
}

module.exports = ProductController;
