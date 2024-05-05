const ProductService = require('@services/product.service');
const { BadRequest } = require('@exceptions/error.excecptions');

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

class ProductController {
  static async getAllProducts(req, res, next) {
    try {
      let { page, limit } = req.query;

      if ((page && isNaN(page)) || (limit && isNaN(limit))) {
        throw new BadRequest('Query parameter error', 'limit and page have to be a number');
      }

      page = +page || DEFAULT_PAGE;
      limit = +limit || DEFAULT_LIMIT;

      console.log(page, limit);

      const products = await ProductService.getAllProducts({
        page,
        limit,
      });
      res.status(200).json(products);
    } catch (e) {
      next(e);
    }
  }

  static async getProductDetail(req, res, next) {
    try {
      const id = req.params.id;
      const product = await ProductService.getProductDetail(id);
      res.status(200).json(product);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = ProductController;
