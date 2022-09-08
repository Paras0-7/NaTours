const Review = require('./../models/reviewsModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllReviews = catchAsync(async function (req, res, next) {
  const reviews = await Review.find();
  res.status(200).json({
    status: 'Success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async function (req, res, next) {
  if (!req.body.tour) {
    req.body.tour = req.params.tourId;
  }
  if (!req.body.user) {
    req.body.user = req.user.id;
  }
  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'Success',
    data: {
      review: newReview,
    },
  });
});
