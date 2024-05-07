const CategoryService = require('@src/services/category.service');

class CategoryController {
  static async getAllCategories(req, res, next) {
    try {
      const categories = await CategoryService.getAllCategories();
      res.status(200).json(categories);
    } catch (e) {
      next(e);
    }
  }

  static async addCategory(req, res, next) {
    try {
      const { categoryName, categoryDescription, productName, productDescription } = req.body;
      await CategoryService.addCategory(
        categoryName,
        categoryDescription,
        productName,
        productDescription,
      );
      res.status(201).json({ message: 'category added successfully' });
    } catch (e) {
      next(e);
    }
  }

  static async editCategory(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description, imageUrl } = req.body;
      await CategoryService.editCategory(id, name, description, imageUrl);
      res.status(200).json({ message: 'category edited successfully' });
    } catch (e) {
      next(e);
    }
  }

  static async removeCategory(req, res, next) {
    try {
      const { id } = req.params;
      await CategoryService.removeCategory(id);
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (e) {
      next(e);
    }
  }

  static async getProductsBasedOnCategory(req, res, next) {
    try {
      const { id } = req.params;
      const categoryId = +id;
      const data = await CategoryService.getIdProduct(categoryId);
      const productId = data.productCategories[0].productId;
      const products = await CategoryService.getProductByCategory(productId);
      const categoryName = data.name;
      res.status(200).json({ message: 'OK', data: { category: categoryName, products: products } });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = CategoryController;
