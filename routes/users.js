const express = require('express');

const usersController = require('../controllers/users-controllers');

const router = express.Router();

router.get('/signup', usersController.getSignup);
router.post('/signup', usersController.postSignup);
router.get('/login', usersController.getLogin);
router.post('/login', usersController.postLogin);
router.post('/logout', usersController.postLogout);

module.exports = router;
