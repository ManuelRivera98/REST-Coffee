const boom = require('@hapi/boom');
const { config } = require('../../config');

const withErrorStack = (error, stack) => {
  if (config.dev) {
    return { ...error, stack, };
  }

  return error;
};

const logErrors = (error, req, res, next) => {
  console.log(error);
  next(error);
};

const wrapErrors = (error, req, res, next) => {
  if (!error.isBoom) {
    next(boom.badImplementation(error));
  };

  next(error);
};

const errorHandler = (error, req, res, next) => {
  const { output: { statusCode, payload }, errors } = error;

  const err = errors ? errors : payload;
  const status = errors ? 400 : statusCode

  res.status(status).json(withErrorStack(err, error.stack));
};

module.exports = {
  logErrors,
  errorHandler,
  wrapErrors,
};