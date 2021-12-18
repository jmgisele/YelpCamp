const express = require('express');
const router = express.Router();
const User = require('../models/user');
const AsyncErrorHandler = require('../utils/AsyncErrorHandler');
const passport = require('passport')
const isLoggedIn = require('../middleware')


router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', AsyncErrorHandler(async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'You\'ve successfully registered. Welcome to YelpCamp!')
            res.redirect('/campgrounds')
        })
    } catch(e) {
        req.flash('error', e.message)
        res.redirect('register')
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login')
})


router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login', successFlash: true}), (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/camprgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.flash('success', 'Logged out!');
    res.redirect('/campgrounds');
})


module.exports = router;