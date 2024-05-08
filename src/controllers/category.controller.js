const { getPaginationStatus } = require('@src/libs/pagination');
const CategoryService = require('@src/services/category.service');

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

class CategoryController {
  static async getAllCategories(req, res, next) {
    try {
      let { page, limit } = req.query;
      if (!page) page = DEFAULT_PAGE;
      if (!limit) limit = DEFAULT_LIMIT;
      page = +page;
      limit = +limit;
      const categories = await CategoryService.getAllCategories({ page, limit });
      const totalCount = await CategoryService.getAllCount();
      const pagination = getPaginationStatus(page, limit, totalCount);
      res
        .status(200)
        .json({ message: 'Get all categories success', categories: categories, pagination });
    } catch (e) {
      next(e);
    }
  }

  static async addCategory(req, res, next) {
    try {
      const { categoryName } = req.body;
      await CategoryService.addCategory(categoryName);
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
      const category = await CategoryService.getProductByCategory(categoryId);
      res.status(200).json({ message: 'OK', category });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = CategoryController;
