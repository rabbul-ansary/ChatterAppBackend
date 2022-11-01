const express = require('express');
const router = express.Router();
const controllers = require('../../controllers/user.controller');
const multer = require('multer');
const request_param = multer();

// router.all('/*', auth.authenticateAPI);
// router.get('/login', controllers.loginPage);
// router.post('/login', controllers.login);


router.get('/register', controllers.registerPage);
router.post('/register', request_param.any(), controllers.register);

module.exports = router;