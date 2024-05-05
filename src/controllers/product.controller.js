const ProductService = require('@services/product.service');
const { BadRequest } = require('@exceptions/error.excecptions');
const { successResponse } = require('@responses/responses');

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

      const products = await ProductService.getAll({
        page,
        limit,
      });
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
      res.status(200).json(successResponse(product, 'Products edited successfully!'));
    } catch (e) {
      next(e);
    }
  }
}

module.exports = ProductController;
