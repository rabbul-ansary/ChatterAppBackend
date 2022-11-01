const express = require('express');
const router = express.Router();
const controllers = require('../controllers/admin.controller');

router.get('/admin', controllers.admin);

module.exports = router;