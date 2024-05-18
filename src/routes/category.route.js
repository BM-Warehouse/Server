const CategoryController = require('@src/controllers/category.controller');
const { adminAuthorization } = require('@src/middlewares/auth');
const router = require('express').Router();

router.get('/', CategoryController.getAllCategories);

router.get('/:id', CategoryController.getProductsBasedOnCategory);
// router.get('/:id', CategoryController.getCategoryDetail);

router.use(adminAuthorization);

router.post('/', CategoryController.addCategory);

router.put('/set', CategoryController.setCategoryforProduct);

router.put('/:id', CategoryController.editCategory);

router.delete('/', CategoryController.removeProductCategory);

router.delete('/:id', CategoryController.removeCategory);

module.exports = router;
