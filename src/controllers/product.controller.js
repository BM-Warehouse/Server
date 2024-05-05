const ProductService = require('@services/product.service');

class ProductController {
  static async getAllProducts(req, res, next) {
    try {
      const products = await ProductService.getAllProducts();
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
