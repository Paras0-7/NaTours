const AppError = require('./../utils/appError');

const handleCastErroDB = function (err) {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = function (err) {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value :${value}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = function (err) {
  const errors = Object.values(err.errors).map((value) => value.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWError = function (err) {
  return new AppError('Invalid token. Please login again', 401);
};

const handleJWTExpiredError = function (err) {
  return new AppError('Your token has expired. Please login again', 401);
};
module.exports = function (err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  console.log('Error');
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
    });
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') {
      error = handleCastErroDB(error);
    }

    if (error.name === 'MongoError') {
      error = handleDuplicateFieldsDB(error);
    }

    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }

    if (error.name === 'JsonWebTokenError') error = handleJWError(error);

    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError(Error);
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }
};
