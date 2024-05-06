const router = require('express').Router();
const productRoute = require('@routes/product.route');
const categoryRoute = require('@routes/category.route');
const userRoute = require('@routes/user.route');

/**** Koleksi Route disini *******/
router.use('/api/products', productRoute);
router.use('/api/categories', categoryRoute);
router.use('/api/users', userRoute);

module.exports = router;
