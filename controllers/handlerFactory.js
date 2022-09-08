const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('./../utils/APIFeatures');

exports.createOne = function (Model) {
  return catchAsync(async function (req, res, next) {
    const document = await Model.create(req.body);

    res.status(200).json({
      status: 'Success',
      data: {
        data: document,
      },
    });
  });
};

exports.getOne = function (Model, populateOptions) {
  return catchAsync(async function (req, res, next) {
    let query = Model.findById(req.params.id);
    if (populateOptions) {
      query.populate(populateOptions);
    }

    const document = await query;
    if (!document) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'Success',
      data: {
        data: document,
      },
    });
  });
};

exports.getAll = function (Model) {
  return catchAsync(async function (req, res, next) {
    // nested get reviews on tours
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    //  build query
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // execute query
    const documents = await features.query;

    // send response

    res.status(200).json({
      status: 'Success',
      results: documents.length,
      data: {
        data: documents,
      },
    });
  });
};
exports.updateOne = function (Model) {
  return catchAsync(async function (req, res, next) {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!document) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'Success',
      data: {
        data: document,
      },
    });
  });
};

exports.deleteOne = function (Model) {
  return catchAsync(async function (req, res, next) {
    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'Success',
      data: null,
    });
  });
};
