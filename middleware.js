const mongoose = require('mongoose')
const Campground = require('./models/campground');
const Review = require('./models/review')
const ExpressError = require('./utils/ExpressError');
const { reviewSchema, campgroundSchema } = require('./schemas');
const { exist } = require('joi');

const isCampground = async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
        req.flash('error', 'Sorry, we can\'t find that campground! Maybe it was deleted?')
        return res.redirect(`/campgrounds`)
    }
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Sorry, we can\'t find that campground! Maybe it was deleted?')
        return res.redirect('/campgrounds')
    }
    next();
}

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be logged in to do that!')
        return res.redirect('/login')
    }
    next();
}


const isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'Sorry! You don\'t have permission to do that.')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}


const isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id) || !review) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}


const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports = {
    isCampground,
    isLoggedIn,
    isAuthor,
    isReviewAuthor,
    validateCampground,
    validateReview,
}