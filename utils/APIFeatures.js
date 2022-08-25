class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1) Filtering
    const queryObj = { ...this.queryString }; // this.queryString = req.query
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(function (field) {
      delete queryObj[field];
    });

    // 2) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, function (match) {
      return `$${match}`;
    });
    console.log('filtering');

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    // 3) Sorting

    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt'); // default sort
    }

    return this;
  }

  limitFields() {
    // 4) field limiting
    //  fields to show : name, difficulty, price

    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    // 5) Pagination

    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;

    const skip = limit * (page - 1);
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
