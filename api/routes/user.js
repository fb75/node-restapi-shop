const express = require('express');
const router = express.Router();
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
const usersController = require('../controllers/users');

// const User = require('../models/user');

router.post('/info', checkAuth, usersController.users_get_me);
router.post('/signup', usersController.users_signup);
router.post('/login', usersController.users_login);
router.delete('/:userId', usersController.users_delete_one);

module.exports = router;