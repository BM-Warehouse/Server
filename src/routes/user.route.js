const UserController = require('@controllers/user.controller');
const { authorization } = require('@middlewares/auth');
const router = require('express').Router();

router.get('/', UserController.getAllUsers);

router.get('/:id', UserController.getDetailUser);

router.use(authorization);

router.post('/', UserController.createUser);

router.put('/:id', UserController.updateUser);

router.delete('/:id', UserController.destroyUser);

module.exports = router;
