const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');

// Conf
const { config } = require('../../config');

function jwtAuthentication(req, res, next) {
  const token = req.get('Authorization');

  if (!token) return next(boom.unauthorized('Token is require.'));

  try {
    const payload = jwt.verify(token, config.jwtSecret);

    req.user = payload;
    next();
  } catch (error) {
    next(boom.unauthorized(error));
  }
};

function jwtAuthenticationParams(req, res, next) {
  const { token } = req.query;

  if (!token) return next(boom.unauthorized('Token is require.'));

  try {
    const payload = jwt.verify(token, config.jwtSecret);

    req.user = payload;
    next();
  } catch (error) {
    next(boom.unauthorized(error));
  }
};

module.exports = {
  jwtAuthentication,
  jwtAuthenticationParams,
};