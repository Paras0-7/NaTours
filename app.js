const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

app.use(function (req, res, next) {
  console.log('Hello from the middleware');
  next();
});
const toursData = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = function (req, res) {
  res.status(200).json({
    status: 'Success',
    results: toursData.length,
    data: {
      tours: toursData,
    },
  });
};

const getTour = function (req, res) {
  const { id } = req.params;
  const tour = toursData.find((tour) => tour.id == id);
  res.status(200).json({
    message: 'succes',
    tour,
  });
};

const createTour = function (req, res) {
  const newTour = Object.assign({ id: toursData.length }, req.body);
  toursData.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(toursData),
    (err) => {
      res.status(201).json({
        status: 'success',
        tour: newTour,
      });
    }
  );
};

const updateTour = function (req, res) {
  const { id } = req.params;
  res.status(200).json({
    status: 'success',
    data: {
      tour: toursData[+id],
    },
  });
  const tour = toursData.find((tour) => tour.id == id);
};

const getAllUsers = function (req, res) {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined',
  });
};

const getUser = function (req, res) {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined',
  });
};

const createUser = function (req, res) {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined',
  });
};

const updateUser = function (req, res) {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined',
  });
};

const tourRouter = express.Router();
const userRouter = express.Router();
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

tourRouter.route('/').get(getAllTours).post(createTour);

tourRouter.route('/:id').get(getTour).patch(updateTour);

userRouter.route('/').get(getAllUsers).post(createUser);

userRouter.route('/:id').get(getUser).patch(updateUser);

const port = 3000;
app.listen(port, function () {
  console.log('App running on port 3000');
});
