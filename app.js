const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');
const hpp = require('hpp');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// middlewares

// security headers

app.use(helmet());
// rate limiting

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'To many requests from this IP! Please try again in an hour',
});
app.use('/api', limiter);

// data sanitization against NoSQL query injection
// {"email" : {"gt" :""}}

app.use(mongoSanitize());

// data sanitization against XSS

app.use(xss());

// preventing parameter pollution

app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', function (req, res, next) {
  // res.status(404).json({
  //   status: 'Fail',
  //   message: `Can't find ${req.originalUrl}`,
  // });

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
