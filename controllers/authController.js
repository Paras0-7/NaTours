const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const jwt = require('jsonwebtoken');

const jwtSignToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
exports.signUp = catchAsync(async function (req, res, next) {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = jwtSignToken(newUser._id);
  res.status(201).json({
    status: 'Success',
    token,
    data: {
      User: newUser,
    },
  });
});

exports.login = catchAsync(async function (req, res, next) {
  const { email, password } = req.body;
  // 1) check if email and password actually exists
  if (!email || !password)
    return next(new AppError('Please provide email and password'), 400);

  // 2) check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');
  // const correct = await user.correctPassword(password, user.password);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // 3) if everything ok, send token to client
  const token = jwtSignToken(user._id);

  res.status(200).json({
    status: 'Success',
    token,
  });
});

exports.protectedRoute = catchAsync(async function (req, res, next) {
  let token;
  // 1) Getting token and check if it exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }
  // 2) Validate the token
  // 3) check if user still exists
  // 4) check if user changed password after the token was issued
  next();
});
