const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/APIFeatures');
exports.aliasTopTours = function (req, res, next) {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async function (req, res) {
  try {
    //  build query

    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // execute query
    const tours = await features.query;

    // send response

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
      message: err,
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

exports.getTourStats = async function (req, res) {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: '$difficulty',
          totalRatings: { $sum: '$ratingsQuantity' },
          totalTours: { $sum: 1 },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },

      {
        $sort: { avgPrice: 1 },
      },
    ]);

    res.status(200).json({
      status: 'Success',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: 'Invalid data sent',
    });
  }
};
