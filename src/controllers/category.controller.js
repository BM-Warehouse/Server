const { getPaginationStatus } = require('@src/libs/pagination');
const { successResponse } = require('@src/responses/responses');
const CategoryService = require('@src/services/category.service');

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

class CategoryController {
  static async getAllCategories(req, res, next) {
    try {
      let payload = req.query;
      payload.page = +payload.page || DEFAULT_PAGE;
      payload.limit = +payload.limit || DEFAULT_LIMIT;

      const categories = await CategoryService.getAllCategories(payload);
      const totalCount = await CategoryService.getAllCount();
      const pagination = getPaginationStatus(payload.page, payload.limit, totalCount);
      res
        .status(200)
        .json({ message: 'Get all categories success', categories: categories, pagination });
    } catch (e) {
      next(e);
    }
  }

  static async addCategory(req, res, next) {
    try {
      const { name } = req.body;
      await CategoryService.addCategory(name);
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

  static async setCategoryforProduct(req, res, next) {
    try {
      const { productId, categoryId } = req.body;
      const category = await CategoryService.setCategoryforProduct(productId, categoryId);
      res.status(201).json(successResponse({ category }, 'Set category successfully'));
    } catch (e) {
      next(e);
    }
  }

  static async removeProductCategory(req, res, next) {
    try {
      const { productId, categoryId } = req.body;
      const removed = await CategoryService.removeProductCategory(productId, categoryId);
      res.json(successResponse({ removed }, 'remove product-category relation success'));
    } catch (e) {
      next(e);
    }
  }
}

module.exports = CategoryController;
