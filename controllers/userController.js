const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const filterObj = function (obj, ...allowedFields) {
  const newObj = {};
  allowedFields.forEach((field) => {
    obj[field] ? (newObj[field] = obj[field]) : '';
  });

  console.log(newObj);
  return newObj;
};

exports.createUser = catchAsync(async function (req, res, next) {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not defined. Pleaseuse /signUp instead',
  });
});

exports.getMe = function (req, res, next) {
  req.params.id = req.user.id;
  next();
};
exports.updateMyData = catchAsync(async function (req, res, next) {
  console.log('Data');
  // 1) Create error if user POSTs password data
  if (req.body.password) {
    return next(
      new AppError(
        'This route is not for updating password. Please use  /updateMyPassword',
        400
      )
    );
  }
  // 2) Update the user document
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'Success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deactivateAccount = catchAsync(async function (req, res, next) {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'Success',
    data: null,
  });
});

exports.getAllUsers = factory.getAll(User);

exports.getUser = factory.getOne(User);

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
