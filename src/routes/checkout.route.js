const CheckoutController = require('@controllers/checkout.controller');
const router = require('express').Router();

router.get('/', CheckoutController.getAll);

router.get('/:id', CheckoutController.getDetail);

router.post('/', CheckoutController.add);

router.put('/:id', CheckoutController.update);

router.delete('/:id', CheckoutController.remove);

module.exports = router;