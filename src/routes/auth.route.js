const AuthController = require('@controllers/auth.controller');
const router = require('express').Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

module.exports = router;
