const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

// console.log(process.env);
const port = process.env.port || 3000;
app.listen(port, function () {
  console.log(`App running on port ${port}.....`);
});
