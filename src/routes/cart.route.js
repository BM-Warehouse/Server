const CartController = require('@src/controllers/cart.controller');
const router = require('express').Router();

router.get('/', CartController.getAllCarts);
router.get('/user', CartController.showCart);

router.post('/', CartController.resetCart);
router.post('/addProduct', CartController.addProductToCart);

router.put('/:id', CartController.updateCart);

router.delete('/', CartController.deleteItem);

module.exports = router;
