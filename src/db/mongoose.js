require('dotenv').config();
const mongoose = require('mongoose');

//Mongose Connection
const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  };

mongoose.connect(process.env.DB_CONNECTION, options);

