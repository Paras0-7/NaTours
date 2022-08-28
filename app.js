const express = require('express');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// middlewares
app.use(express.json());

app.use(express.static(`${__dirname}/public`));

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', function (req, res, next) {
  // res.status(404).json({
  //   status: 'Fail',
  //   message: `Can't find ${req.originalUrl}`,
  // });

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
