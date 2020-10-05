const boom = require('@hapi/boom');

const notFountHandler = (request, response) => {
  const { output: { statusCode, payload } } = boom.notFound();

  response.status(statusCode).json(payload);
};

module.exports = {
  notFountHandler,
};