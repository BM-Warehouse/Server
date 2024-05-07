const ProductController = require('@controllers/product.controller');
const router = require('express').Router();

router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getDetail);
router.post('/', ProductController.add);
router.put('/:id', ProductController.edit);
router.delete('/:id', ProductController.delete);

router.post('/warehouse/add', ProductController.addToWarehouse);
router.post('/warehouse/move', ProductController.moveWarehouse);

module.exports = router;
