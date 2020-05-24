require('dotenv').config();
const mongoose = require('mongoose');

//Mongose Connection
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false 
  };

mongoose.connect(DB_CONNECTION, options);

