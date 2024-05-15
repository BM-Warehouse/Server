const UserController = require('@controllers/user.controller');
const { adminAuthorization } = require('@middlewares/auth');
const router = require('express').Router();

router.get('/me', UserController.getLoginUser);

router.use(adminAuthorization);

router.get('/', UserController.getAllUsers);

router.get('/:id', UserController.getDetailUser);

router.use(adminAuthorization);

router.post('/', UserController.createUser);

router.put('/:id', UserController.updateUser);

router.delete('/:id', UserController.destroyUser);

module.exports = router;
