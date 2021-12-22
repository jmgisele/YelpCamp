const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage })
const AsyncErrorHandler = require('../utils/AsyncErrorHandler');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')
const campgrounds = require('../controllers/campgrounds')


router.route('/')
    .get(AsyncErrorHandler(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, AsyncErrorHandler(campgrounds.createCampground))

router.get('/new', isLoggedIn, campgrounds.renderNewForm)


router.route('/:id')
    .get(AsyncErrorHandler(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, AsyncErrorHandler(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, AsyncErrorHandler(campgrounds.deleteCampground))


router.get('/:id/edit', isLoggedIn, isAuthor, AsyncErrorHandler(campgrounds.renderEditForm))

module.exports = router;