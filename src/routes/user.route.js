const UserController = require('@controllers/user.controller');
const router = require('express').Router();
// const auth = require('@middlewares/auth');

router.get('/', UserController.getAllUsers);

router.get('/:id', UserController.getDetailUser);

// router.use(auth.authorization);

router.post('/', UserController.createUser);

router.put('/:id', UserController.updateUser);

router.delete('/:id', UserController.destroyUser);

module.exports = router;
