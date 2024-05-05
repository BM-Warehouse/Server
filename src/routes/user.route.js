const UserController = require('@controllers/user.controller');
const router = require('express').Router();

router.get('/', UserController.getAllUsers);

router.get('/:id', UserController.getDetailUser);

router.post('/', UserController.createUser);

module.exports = router;
