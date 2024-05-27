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

      const { categories, count } = await CategoryService.getAllCategories(payload);
      const pagination = getPaginationStatus(payload.page, payload.limit, count);
      res
        .status(200)
        .json(successResponse({ categories, pagination }, 'get all category successfully'));
    } catch (e) {
      next(e);
    }
  }

  static async getCategoryDetail(req, res, next) {
    try {
      const category = await CategoryService.getCategoryDetail(req.params);
      res.status(200).json(successResponse(category, 'get category detail successfully'));
    } catch (e) {
      next(e);
    }
  }

  static async addCategory(req, res, next) {
    try {
      const newCategory = await CategoryService.addCategory(req.body);
      res.status(201).json(successResponse(newCategory, 'category added successfully'));
    } catch (e) {
      next(e);
    }
  }

  static async editCategory(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description, imageUrl } = req.body;
      const editedCategory = await CategoryService.editCategory(id, name, description, imageUrl);
      res.status(200).json(successResponse(editedCategory, 'category edited successfully'));
    } catch (e) {
      next(e);
    }
  }

  static async removeCategory(req, res, next) {
    try {
      const { id } = req.params;
      const removed = await CategoryService.removeCategory(id);
      res.status(200).json(successResponse({ removed }, 'Category deleted successfully'));
    } catch (e) {
      next(e);
    }
  }

  static async getProductsBasedOnCategory(req, res, next) {
    try {
      const { id } = req.params;
      const categoryId = +id;
      const category = await CategoryService.getProductByCategory(categoryId);
      res.status(200).json(successResponse(category, 'OK'));
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
      const removed = await CategoryService.removeProductCategory(req.body);
      res
        .status(200)
        .json(successResponse({ removed }, 'remove product-category relation success'));
    } catch (e) {
      next(e);
    }
  }
}

module.exports = CategoryController;
