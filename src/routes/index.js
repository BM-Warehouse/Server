const router = require('express').Router();
const productRoute = require('@routes/product.route');

/**** Koleksi Route disini *******/
router.use('/api/products', productRoute);

module.exports = router;
