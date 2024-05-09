const router = require('express').Router();
const authRoute = require('@routes/auth.route');
const productRoute = require('@routes/product.route');
const categoryRoute = require('@routes/category.route');
const userRoute = require('@routes/user.route');
const checkoutRoute = require('@routes/checkout.route');
const warehouseRoute = require('@routes/warehouse.route');
const cartRoute = require('@routes/cart.route');
const { authentication } = require('@middlewares/auth');

/**** Koleksi Route disini *******/
router.use('/api', authRoute);
router.use(authentication);
router.use('/api/products', productRoute);
router.use('/api/categories', categoryRoute);
router.use('/api/users', userRoute);
router.use('/api/checkout', checkoutRoute);
router.use('/api/warehouses', warehouseRoute);
router.use('/api/carts', cartRoute);

module.exports = router;
