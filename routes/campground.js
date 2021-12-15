const express = require('express')
const router = express.Router()
const ExpressError = require('../utils/ExpressError');
const AsyncErrorHandler = require('../utils/AsyncErrorHandler');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { campgroundSchema } = require('../schemas.js');



const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


router.get('/', AsyncErrorHandler(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}))

router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})

router.post('/', validateCampground, AsyncErrorHandler(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully added campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id', AsyncErrorHandler(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if(!campground) {
        req.flash('error', 'Sorry, we can\'t find that campground! Maybe it was deleted?')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
}))

router.get('/:id/edit', AsyncErrorHandler(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground) {
        req.flash('error', 'Sorry, we can\'t find that campground! Maybe it was deleted?')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/update', { campground })
}))

router.put('/:id', validateCampground, AsyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:id', AsyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds')
}))


module.exports = router;