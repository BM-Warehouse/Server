const ProductController = require('@controllers/product.controller');
const { adminAuthorization } = require('@src/middlewares/auth');
const router = require('express').Router();

router.get('/', ProductController.getAll);
router.get('/detail/:id', ProductController.getDetail);

router.use(adminAuthorization);
router.post('/', ProductController.add);
router.put('/:id', ProductController.edit);
router.delete('/:id', ProductController.delete);

router.post('/warehouse/add', ProductController.addToWarehouse);
router.post('/warehouse/move', ProductController.moveWarehouse);
router.get('/expired', ProductController.getExpired);
router.post('/damage', ProductController.damage);

module.exports = router;
