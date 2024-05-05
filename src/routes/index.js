const router = require('express').Router();
const productRoute = require('@routes/product.route');
const categoryRoute = require('@routes/category.route');

/**** Koleksi Route disini *******/
router.use('/api/products', productRoute);
router.use('/api/categories', categoryRoute);

module.exports = router;
