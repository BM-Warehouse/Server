const router = require('express').Router();
const productRoute = require('@routes/product.route');
const categoryRoute = require('@routes/category.route');
const checkoutRoute = require('@routes/checkout.route');

/**** Koleksi Route disini *******/
router.use('/api/products', productRoute);
router.use('/api/categories', categoryRoute);
router.use('/api/checkout', checkoutRoute);

module.exports = router;
