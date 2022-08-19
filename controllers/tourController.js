const fs = require('fs');

toursData = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAllTours = function (req, res) {
  res.status(200).json({
    status: 'Success',
    results: toursData.length,
    data: {
      tours: toursData,
    },
  });
};

exports.getTour = function (req, res) {
  const { id } = req.params;
  const tour = toursData.find((tour) => tour.id == id);
  res.status(200).json({
    message: 'succes',
    tour,
  });
};

exports.createTour = function (req, res) {
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

exports.updateTour = function (req, res) {
  const { id } = req.params;
  res.status(200).json({
    status: 'success',
    data: {
      tour: toursData[+id],
    },
  });
  const tour = toursData.find((tour) => tour.id == id);
};
