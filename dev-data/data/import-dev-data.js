const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful!'));
// import data into database

const importData = async function () {
  try {
    const tours = JSON.parse(
      fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')
    );
    await Tour.create(tours);
    console.log('Data Successfully Loaded');
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

const deleteData = async function () {
  try {
    await Tour.deleteMany();
  } catch (err) {}
  process.exit();
};

// console.log(process.argv);

if (process.argv[2] === 'import') {
  importData();
}

if (process.argv[2] === 'delete') {
  deleteData();
}
