const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('./../../models/tourModel');
const mongoose = require('mongoose');
dotenv.config({ path: `${__dirname}/../../config.env` });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => console.log('Database Connected'));

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

const importData = async function () {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded');
    process.exit();
  } catch (err) {}
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    process.exit();
  } catch (err) {}
};
deleteData();
importData();
