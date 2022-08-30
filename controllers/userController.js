const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async function (req, res, next) {
  const users = await User.find();
  res.status(200).json({
    status: 'Success',
    results: users.length,
    data: {
      Users: users,
    },
  });
});

exports.getUser = catchAsync(async function (req, res, next) {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined',
  });
});

exports.createUser = catchAsync(async function (req, res, next) {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined',
  });
});

exports.updateUser = catchAsync(async function (req, res, next) {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined',
  });
});
