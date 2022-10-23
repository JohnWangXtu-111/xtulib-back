const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();


const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);



app.listen(process.env.PORT, () => {
  console.log('Server listening on port ' + process.env.PORT);
});