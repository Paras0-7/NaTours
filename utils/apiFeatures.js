class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString; // req.query
  }

  filter() {
    const queryObj = { ...this.queryString };
    // console.log('query', queryObj);

    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(function (key) {
      delete queryObj[key];
    });

    // advanced filterring

    let queryStr = JSON.stringify(queryObj);
    // console.log(queryStr);
    // >?price[gte]=5  : price :{ get : '5'}
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr));

    // let query = Tour.find(JSON.parse(queryStr));
    console.log(JSON.parse(queryStr));
    this.query.find(JSON.parse(queryStr));

    return this;
  }
  // {"duration":["5","9"]}
  sort() {
    // sorting

    if (this.queryString.sort) {
      // ?sort = price,ratingsAverage

      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
      // - : descending order
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      // query = query.select('name price difficulty')
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // - : not include
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
