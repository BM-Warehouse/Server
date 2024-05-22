const CourierController = require('@src/controllers/courier.controllers');
const router = require('express').Router();

router.get('/', CourierController.getAll);

module.exports = router;
