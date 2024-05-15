const CartController = require('@src/controllers/cart.controller');
// const { userAuthorization } = require('@src/middlewares/auth');
const router = require('express').Router();

// router.use(userAuthorization);

router.get('/all', CartController.getAllCarts);

router.get('/', CartController.showUserCart);

router.post('/', CartController.resetCartToDefault);

router.put('/', CartController.addProductToCart);

router.delete('/:id', CartController.deleteCartProduct);

module.exports = router;
