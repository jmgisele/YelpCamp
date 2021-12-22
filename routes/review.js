const express = require('express')
const router = express.Router({mergeParams: true})
const AsyncErrorHandler = require('../utils/AsyncErrorHandler');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')
const reviews = require('../controllers/reviews')


router.post('/', isLoggedIn, validateReview, AsyncErrorHandler(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, AsyncErrorHandler(reviews.deleteReview));

module.exports = router;