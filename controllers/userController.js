const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');

exports.getAllUsers = async function (req, res) {
  const users = await User.find();
  res.status(500).json({
    status: 'success',
    results: users.length,
    users,
  });
};

exports.createUser = function (req, res) {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
exports.getUser = function (req, res) {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
exports.updateUser = function (req, res) {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
exports.deleteUser = function (req, res) {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

exports.updateMe = catchAsync(async function (req, res, next) {
  // Create error if user POSTs password data

  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updatePassword',
        400
      )
    );
  }

  // filtered out unwanted fields that are not allowed to be updated : like : role - admin
  const filteredBody = filterObj(req.body, 'name', 'email');
  // update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async function (req, res, next) {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'Success',
    data: null,
  });
});
// helper functions

const filterObj = function (data, ...allowedFields) {
  const newObj = {};
  Object.keys(data).forEach((key) => {
    if (allowedFields.includes(key)) {
      newObj[key] = data[key];
    }
  });
  return newObj;
};
