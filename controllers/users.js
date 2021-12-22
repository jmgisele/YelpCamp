const User = require('../models/user');


const renderRegister = (req, res) => {
    res.render('users/register');
}

const registerUser = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'You\'ve successfully registered. Welcome to YelpCamp!')
            res.redirect('/campgrounds')
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('register')
    }
}

const renderLogin =  (req, res) => {
    res.render('users/login')
}


const loginUser =  (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/camprgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

const logoutUser = (req, res) => {
    req.logout();
    req.flash('success', 'Logged out!');
    res.redirect('/campgrounds');
}

module.exports = {
    renderRegister,
    registerUser,
    renderLogin,
    loginUser,
    logoutUser
}