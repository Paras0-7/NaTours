exports.getAllTours = async function (req, res) {
  try {
    console.log(req.query);
    // filterring

    // const queryObj = { ...req.query };

    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach(function (key) {
    //   delete queryObj[key];
    // });

    // // advanced filterring

    // let queryStr = JSON.stringify(queryObj);
    // // console.log(queryStr);
    // // >?price[gte]=5  : price :{ get : '5'}
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // // console.log(JSON.parse(queryStr));

    // let query = Tour.find(JSON.parse(queryStr));

    // sorting

    if (req.query.sort) {
      // ?sort = price,ratingsAverage
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
      // - : descending order
    }

    // field limiting
    // fields to show
    // ?fields = name,price,ratings
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      // query = query.select('name price difficulty')
      query = query.select(fields);
    } else {
      query = query.select('-__v'); // - : not include
    }

    // pagination
    //  ?page=1&limit=3
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    console.log(typeof limit);

    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
    }

    //
    // execute query
    const tours = await query;
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(9)
    //   .where('difficulty')
    //   .equals('medium');
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err.message,
    });
  }
};

exports.getTour = async function (req, res) {
  // console.log(req.params);
  try {
    const id = req.params.id;
    // const tour = await Tour.find({ _id: id });
    const tour = await Tour.findById(id);
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: 'Invalid Dataset',
    });
  }
};

exports.createTour = async function (req, res) {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'message',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: 'Invalid Dataset',
    });
  }
};

exports.updateTour = async function (req, res) {
  try {
    const id = req.params.id;
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200);
    res.send({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(400);
    res.send(
      json({
        status: 'Fail',
        message: err.message,
      })
    );
  }
};

exports.deleteTour = async function (req, res) {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err.message,
    });
  }
};

exports.aliasTopTours = function (req, res, next) {
  const query = {
    limit: '5',
    sort: '-ratingsAverage,price',
    fields: 'name,price,summary,ratingsAverage,difficulty',
  };

  req.query = query;
  next();
};
