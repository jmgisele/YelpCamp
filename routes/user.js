const express = require('express');
const router = express.Router();
const AsyncErrorHandler = require('../utils/AsyncErrorHandler');
const passport = require('passport')
const { isLoggedIn } = require('../middleware')
const users = require('../controllers/users')

router.route('/register')
    .get( users.renderRegister)
    .post(AsyncErrorHandler(users.registerUser))


router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', successFlash: true }), 
        users.loginUser)

router.get('/logout', isLoggedIn, users.logoutUser)

module.exports = router;