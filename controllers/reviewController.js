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
  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'Success',
    data: {
      review: newReview,
    },
  });
});
