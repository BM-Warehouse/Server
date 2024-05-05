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

  static async getDetailCategory(req, res, next) {
    try {
      const { id } = req.params;
      const category = await CategoryService.getDetailCategory(id);
      res.status(200).json(category);
    } catch (e) {
      next(e);
    }
  }

  static async addCategory(req, res, next) {
    try {
      const { name, description, imageUrl } = req.body;
      await CategoryService.addCategory(name, description, imageUrl);
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
}

module.exports = CategoryController;
