const CategoryController = require('@src/controllers/category.controller');
const router = require('express').Router();

router.get('/', CategoryController.getAllCategories);

router.get('/:id', CategoryController.getDetailCategory);

router.post('/', CategoryController.addCategory);

module.exports = router;
