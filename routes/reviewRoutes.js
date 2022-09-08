const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protectedRoute,
    authController.restrictTo('user'),
    reviewController.createReview
  )
  .delete(
    authController.protectedRoute,
    authController.restrictTo('admin'),
    reviewController.deleteReview
  );

router.route('/:id').delete(reviewController.deleteReview);
module.exports = router;
