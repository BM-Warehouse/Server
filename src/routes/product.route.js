const ProductController = require('@controllers/product.controller');
const router = require('express').Router();

router.get('/', ProductController.getAllProducts);

router.get('/:id', ProductController.getProductDetail);

module.exports = router;
