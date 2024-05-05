const CategoryController = require('@src/controllers/category.controller');
const router = require('express').Router();

router.get('/', CategoryController.getAllCategories);

router.get('/:id', CategoryController.getDetailCategory);

router.post('/', CategoryController.addCategory);

router.put('/:id', CategoryController.editCategory);

router.delete('/:id', CategoryController.removeCategory);

module.exports = router;
