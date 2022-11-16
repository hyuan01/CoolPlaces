const express = require('express');
const router = express.Router();
const passport = require('passport');
const users = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');

// register
router.route('/register')
    .get(users.registerPage)
    .post(catchAsync(users.registerUser));

// login page
router.route('/login')
    .get(users.loginPage)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}), users.loginUser);

// logout
router.get('/logout', users.logoutUser);

module.exports = router;