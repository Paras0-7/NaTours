const express = require('express');
const tourController = require('./../controllers/tourController');
const reviewRouter = require('./../routes/reviewRoutes');
const router = express.Router();
const authController = require('./../controllers/authController');
// router.param('id', tourController.checkId);
router
  .route('/top-5-cheap-tours')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protectedRoute,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );
router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protectedRoute,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protectedRoute,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.protectedRoute,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

router.use('/:tourId/reviews', reviewRouter);
// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protectedRoute,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );
module.exports = router;
