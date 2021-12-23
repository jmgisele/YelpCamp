const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}

const renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

const createCampground = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.geometry = geoData.body.features[0].geometry;
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully added campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}

const showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Sorry, we can\'t find that campground! Maybe it was deleted?')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
}

const renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Sorry, we can\'t find that campground! Maybe it was deleted?')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/update', { campground })
}

const updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`);
}

const deleteCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    for (let image of campground.images) {
        await cloudinary.uploader.destroy(image.filename);
    }
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds')
}


module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds');

}

module.exports = {
    index,
    renderNewForm,
    createCampground,
    showCampground,
    renderEditForm,
    updateCampground,
    deleteCampground
}