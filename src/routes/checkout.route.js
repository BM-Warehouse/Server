const CheckoutController = require('@controllers/checkout.controller');
const router = require('express').Router();

router.get('/', CheckoutController.getAll);

router.post('/action', CheckoutController.action);
router.post('/send', CheckoutController.send);
router.post('/feedback', CheckoutController.feedback);
router.get('/:id', CheckoutController.getDetail);

router.post('/', CheckoutController.add);

router.put('/:id', CheckoutController.update);

router.delete('/:id', CheckoutController.remove);

module.exports = router;
