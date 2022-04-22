const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);
exports.getAllTours = function (req, res) {
  res.status(200).json({
    status: 'success',
    requestTime: req.requestTime,
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

exports.getTour = function (req, res) {
  // console.log(req.params);

  const id = req.params.id * 1;

  if (id >= tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid id' });
  }

  const tour = getTourById(id);

  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
};

exports.createTour = function (req, res) {
  // console.log(req.body);
  const newId = tours.length;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    function (err) {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.updateTour = function (req, res) {
  const id = req.params.id * 1;
  const tour = getTourById(id);

  const updatedTour = Object.assign(tour, req.body);
  tours.push(updatedTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    function (err) {
      res.status(200).json({
        status: 'success',
        data: {
          tour: updatedTour,
        },
      });
    }
  );
};

exports.deleteTour = function (req, res) {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const getTourById = function (id) {
  const tour = tours.find(function (element) {
    return element.id === id;
  });

  return tour;
};
