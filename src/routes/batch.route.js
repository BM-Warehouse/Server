const BatchController = require('@controllers/batch.controller');
const { adminAuthorization } = require('@src/middlewares/auth');
const router = require('express').Router();

router.use(adminAuthorization);
router.get('/', BatchController.getAllBatch);
router.get('/expBatch', BatchController.getExpired);

module.exports = router;
