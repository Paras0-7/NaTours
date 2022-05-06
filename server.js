process.on('uncaughtException', function (err) {
  console.log('Uncaught Exception Shutting down');
  console.log(err.name, err.message);

  process.exit(1);
});
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('Database Connection Successful'));
const app = require('./app');

const port = process.env.port || 3000;
const server = app.listen(port, function () {
  console.log(`App running on port ${port}.....`);
});

// global error handling

process.on('unhandledRejection', function (err) {
  console.log(err.name);
  server.close(() => {
    process.exit(1);
  });
});
