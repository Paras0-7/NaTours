const mongoose = require('mongoose');

const reviewsSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, ' Review must belong to a tour'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, ' Review must belong to a User'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Qwery middleware

reviewsSchema.pre(/^find/, function (next) {
  // this.populate({ path: '' , select : '-__v -passwordChangedAt'});
  next();
});

const Review = new mongoose.Model('Review', reviewsSchema);

module.exports = Review;
