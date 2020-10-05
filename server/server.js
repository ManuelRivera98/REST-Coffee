const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

// Controllers
const { userApi } = require('./routes/users');

// conf
const { config } = require('./config');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Routes
userApi(app);

mongoose.connect('mongodb://localhost:27017/coffee', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(res => console.log('DB connected.'))
  .catch(error => console.error(error));

app.listen(config.port, (error) => {
  if (error) return console.error(error);

  console.log(`Listening port: ${config.port}`);
});

