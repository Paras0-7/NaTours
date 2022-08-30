const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });

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

const app = require('./app');
process.on('uncaughtException', function (err) {
  console.log('Unhandled Exception! Shutting down...');

  process.exit(1);
});

const port = process.env.PORT;

const server = app.listen(port, function () {
  console.log(`App running on port ${port}......`);
});

process.on('unhandledRejection', function (err) {
  console.log('Unhandled rejection! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
