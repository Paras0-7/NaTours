const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const jwt = require('jsonwebtoken');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');
const { promisify } = require('util');

const jwtSignToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendJWTToken = function (stautsCode, res, user) {
  const token = jwtSignToken(user._id);
  res.status(stautsCode).json({
    status: 'Success',
    token,
    data: {
      User: user,
    },
  });
};

exports.signUp = catchAsync(async function (req, res, next) {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendJWTToken(201, res, newUser);
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
  createSendJWTToken(201, res, user);
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

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) check if user still exists

  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError('The user belonging to this token does no longer exist', 401)
    );
  // 4) check if user changed password after the token was issued

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please login again...', 401)
    );
  }
  req.user = currentUser;
  // console.log(req.user);
  next();
});

exports.restrictTo = function (...roles) {
  return function (req, res, next) {
    // roles ['admin','lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }
    next();
  };
};

// forgot password

exports.forgotPassword = catchAsync(async function (req, res, next) {
  // 1) Get User based on POSTed email

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError('There is no user with the provided email address', 404)
    );
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });
  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to : ${resetURL}.`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your Password Reset Token (valid for 10 mins)',
      message,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordRestExpires = undefined;

    user.save({ validateBeforeSave: false });
    return next(
      newAppError(
        'There was an error while send an email. Try again later',
        500
      )
    );
  }

  res.status(200).json({
    status: 'Success',
    message: 'Reset Token sent to email address',
  });
});

// reset password
exports.resetPassword = catchAsync(async function (req, res, next) {
  // 1) Get user based on the token

  console.log(req.params.token);
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password

  if (!user) {
    return next(
      new AppError('The password reset token is invalid or expired.', 400)
    );
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // 3) Update changedPasswordAt property for the user
  await user.save();

  // 4) Log the user in, send the JWT

  createSendJWTToken(200, res, user);
});

exports.updatePassword = catchAsync(async function (req, res, next) {
  // 1) Get the user from database
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if the POSTed password is correct
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(
      new AppError(
        'The password do not match with your current password. Please enter the correct password'
      ),
      401
    );
  }
  // 3) If so, update the password

  user.password = newPassword;
  user.passwordConfirm = confirmNewPassword;
  await user.save();
  // 4) Log the user in, send JWT
  createSendJWTToken(200, res, user);
});
