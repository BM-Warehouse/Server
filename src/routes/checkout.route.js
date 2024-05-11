const CheckoutController = require('@controllers/checkout.controller');
const { userAuthorization, adminAuthorization } = require('@src/middlewares/auth');
const router = require('express').Router();

router.get('/', CheckoutController.getAll);

router.post('/action', userAuthorization, CheckoutController.action);

router.post('/send', adminAuthorization, CheckoutController.send);

router.post('/feedback', userAuthorization, CheckoutController.feedback);

router.get('/:checkoutId', userAuthorization, CheckoutController.getDetail);

router.post('/', CheckoutController.add);

router.put('/:checkoutId', CheckoutController.update);

router.delete('/:id', adminAuthorization, CheckoutController.remove);

module.exports = router;
