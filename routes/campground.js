const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary')
const { isCampground, isLoggedIn, isAuthor, validateCampground } = require('../middleware')
const validateImage = require('../utils/validateImage')
const AsyncErrorHandler = require('../utils/AsyncErrorHandler');
const campgrounds = require('../controllers/campgrounds')
const upload = multer({
    storage: storage,
    fileFilter: validateImage
})

router.route('/')
    .get(AsyncErrorHandler(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, AsyncErrorHandler(campgrounds.createCampground))

router.get('/new', isLoggedIn, campgrounds.renderNewForm)


router.route('/:id')
    .get(AsyncErrorHandler(isCampground), AsyncErrorHandler(campgrounds.showCampground))
    .put(AsyncErrorHandler(isCampground), isLoggedIn, AsyncErrorHandler(isAuthor), upload.array('image'), validateCampground, AsyncErrorHandler(campgrounds.updateCampground))
    .delete(AsyncErrorHandler(isCampground), isLoggedIn, AsyncErrorHandler(isAuthor), AsyncErrorHandler(campgrounds.deleteCampground))


router.get('/:id/edit', AsyncErrorHandler(isCampground), isLoggedIn, AsyncErrorHandler(isAuthor), AsyncErrorHandler(campgrounds.renderEditForm))

module.exports = router;