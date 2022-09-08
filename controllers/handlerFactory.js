const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

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
