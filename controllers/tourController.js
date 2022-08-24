const Tour = require('./../models/tourModel');

exports.getAllTours = async function (req, res) {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'Success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
    });
  }
};

exports.getTour = async function (req, res) {
  const { id } = req.params;
  try {
    const tour = await Tour.findById(id);
    res.status(200).json({
      status: 'Success',
      data: {
        tour,
      },
    });
  } catch (err) {}
};

exports.createTour = async function (req, res) {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'Sucess',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: 'Invalid data sent',
    });
  }
};

exports.updateTour = async function (req, res) {
  try {
    const { id } = req.params;

    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {}
};

exports.deleteTour = async function (req, res) {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'Success',
      message: 'Tour deleted successfully',
    });
  } catch (err) {
    res.json({
      message: 'Tour does not exist',
    });
  }
};
