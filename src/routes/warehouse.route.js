const router = require('express').Router();
const WarehouseController = require('@controllers/warehouse.controller');
const { adminAuthorization } = require('@src/middlewares/auth');

router.use(adminAuthorization);
router.get('/', WarehouseController.getAllWarehouses);
router.get('/:id', WarehouseController.getWarehouseDetail);
router.post('/quantities', WarehouseController.getAllWarehouseQuantities);
router.post('/', WarehouseController.addWarehouse);
router.put('/:id', WarehouseController.editWarehouse);
router.delete('/:id', WarehouseController.deleteWarehouse);

module.exports = router;
