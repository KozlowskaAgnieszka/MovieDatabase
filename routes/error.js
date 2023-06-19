const express = require('express');

const errorController = require('../controllers/error-controllers');

const router = express.Router();

router.use(errorController.getErrorPage);

module.exports = router;
