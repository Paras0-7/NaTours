// imports
const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
// express app
const app = express();

// middleware
app.use(express.json()); // middleware 53

app.use(morgan('dev'));

app.use(function (req, res, next) {
  console.log('Hello from the middleware!!!');
  next();
});

app.use(function (req, res, next) {
  req.requestTime = new Date().toISOString();
  next();
});
// app.post('/', function (req, res) {
//   res
//     .status(200)
//     .json({ message: 'Hello World from the Server side', app: 'Natours' });
// });

// app;

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
// );

// // route methods

// const getAllTours = function (req, res) {
//   res.status(200).json({
//     status: 'success',
//     requestTime: req.requestTime,
//     results: tours.length,
//     data: {
//       tours: tours,
//     },
//   });
// };

// const getTour = function (req, res) {
//   // console.log(req.params);

//   const id = req.params.id * 1;

//   if (id >= tours.length) {
//     return res.status(404).json({ status: 'fail', message: 'Invalid id' });
//   }

//   const tour = getTourById(id);

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: tour,
//     },
//   });
// };

// const createTour = function (req, res) {
//   // console.log(req.body);
//   const newId = tours.length;
//   const newTour = Object.assign({ id: newId }, req.body);
//   tours.push(newTour);

//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     function (err) {
//       res.status(201).json({
//         status: 'success',
//         data: {
//           tour: newTour,
//         },
//       });
//     }
//   );
// };

// const updateTour = function (req, res) {
//   const id = req.params.id * 1;
//   const tour = getTourById(id);

//   const updatedTour = Object.assign(tour, req.body);
//   tours.push(updatedTour);
//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     function (err) {
//       res.status(200).json({
//         status: 'success',
//         data: {
//           tour: updatedTour,
//         },
//       });
//     }
//   );
// };

// const deleteTour = function (req, res) {
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// };

// //  users router methods

// const getAllUsers = function (req, res) {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined',
//   });
// };

// const createUser = function (req, res) {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined',
//   });
// };
// const getUser = function (req, res) {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined',
//   });
// };
// const updateUser = function (req, res) {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined',
//   });
// };
// const deleteUser = function (req, res) {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined',
//   });
// };
// //  Routing

// // app.get('/api/v1/tours', getAllTours);

// // // app.get('/api/v1/tours/:id/:name?', function (req, res) {  to make optional parameter -> name?

// // app.get('/api/v1/tours/:id/:name?', getTour );

// // app.post('/api/v1/tours', createTour );

// // app.patch('/api/v1/tours/:id', updateTour);

// // app.delete('/api/v1/tours/:id', deleteTour );

// const tourRouter = express.Router();
// const userRouter = express.Router();
// app.use('/api/v1/tours', tourRouter);
// app.use('/api/v1/users', userRouter);

// tourRouter.route('/').get(getAllTours).post(createTour);

// tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

// userRouter.route('/').get(getAllUsers).post(createUser);

// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
// // helper  methods
// const getTourById = function (id) {
//   const tour = tours.find(function (element) {
//     return element.id === id;
//   });

//   return tour;
// };

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// server
const port = 3000;
app.listen(port, function () {
  console.log(`App running on port ${port}.....`);
});
