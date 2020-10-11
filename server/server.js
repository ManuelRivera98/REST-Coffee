const express = require('express');
const app = express();
const path = require('path');
const fileUpload = require('express-fileupload');

const bodyParser = require('body-parser');

// Controllers
const { userApi } = require('./routes/users');
const { authApi } = require('./routes/auth');
const { categoryApi } = require('./routes/categories');
const { productApi } = require('./routes/products');

// conf
const { config } = require('./config');

// Middleware
const { notFountHandler } = require('./utils/middleware/notFoundHandler');
const { logErrors, wrapErrors, errorHandler } = require('./utils/middleware/errorHandlers');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Statics
const public = path.resolve(__dirname, '../public');
app.use(express.static(public));

// FileUpload middleware
app.use(fileUpload({ useTempFiles: true }));

// Routes
userApi(app);
authApi(app);
categoryApi(app);
productApi(app);

// Catch 404 not found.
app.use(notFountHandler);

// Errors middleware
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(config.port, (error) => {
  if (error) return console.error(error);

  console.log(`Listening port: ${config.port}`);
});

