const express = require('express');
const router = express.Router();
const controllers = require('../../controllers/user.controller');

router.all('/*', auth.authenticateAPI);
router.post('/login', controllers.login);
// router.post('/register', controllers.register);

module.exports = router;