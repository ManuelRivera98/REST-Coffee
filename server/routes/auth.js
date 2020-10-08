const express = require('express');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Conf
const { config } = require('../config');
// Services
const { UsersService } = require('../services/users');
const { ApiKeysService } = require('../services/apiKeys');
// Schemas
const { userSchema } = require('../utils/schemas/users');
// Helpers
const { verify } = require('../utils/helpers/verifyTokenGoogleAApi');

const authApi = (app) => {
  const router = express.Router();
  app.use('/auth', router);

  // Instance service
  const userService = new UsersService();
  const apiKeyService = new ApiKeysService();

  router.post('/sign-up', async (req, res, next) => {
    const { body: data } = req;

    // Instance service
    const userService = new UsersService();

    try {
      const user = await userService.createUser(data, userSchema);

      res.status(201).json({
        ok: true,
        data: user,
      });
    } catch (error) {
      next(error);
    };
  });

  router.post('/login', async (req, res, next) => {
    const { password, email, apiKeyToken } = req.body;

    if (!apiKeyToken) return next(boom.unauthorized('apiKeyToken is require.'));

    if (!email || !password) return next(boom.unauthorized('Email and password are require.'));

    try {
      const users = await userService.getUsers(userSchema, {}, email);
      const user = users.values[0];

      if (!user) return next(boom.badRequest('Wrong email or password.'));

      const passwordIsValid = await bcrypt.compare(password, user.password);

      if (!passwordIsValid) return next(boom.unauthorized('Wrong email or password.'));

      const apiKey = await apiKeyService.getApiKey(apiKeyToken);

      if (apiKey.total === 0) return next(boom.unauthorized());

      const payload = {
        sub: user._id,
        name: user.name,
        email: user.email,
        scopes: apiKey.values[0].scopes,
      };

      const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });

      res.status(200).json({
        ok: true,
        data: users,
        token,
      });
    } catch (error) {
      next(error);
    };
  });

  router.post('/google-api', async (req, res, next) => {
    const { idToken, apiKeyToken } = req.body;

    if (!apiKeyToken) return next(boom.unauthorized('apiKeyToken is require.'));
    if (!idToken) return next(boom.unauthorized('idToken is required to authenticate with google-api.'));

    const apiKey = await apiKeyService.getApiKey(apiKeyToken);
    if (apiKey.total === 0) return next(boom.unauthorized());

    try {
      const googleUser = await verify(idToken);
      const usersDB = await userService.getUsers(userSchema, {}, googleUser.email);
      const user = usersDB.values[0];

      if (user) {
        if (!user.google) return next(boom.unauthorized('Login with your normal account'));

        const payload = {
          sub: user._id,
          name: user.name,
          email: user.email,
          scopes: apiKey.values[0].scopes,
        };

        const token = jwt.sign(payload, config.jwtSecret);

        res.status(200).json({
          ok: true,
          data: user,
          token,
        });
      } else {
        const user = await userService.createUser(googleUser, userSchema);

        const payload = {
          sub: user._id,
          name: user.name,
          email: user.email,
          scopes: apiKey.values[0].scopes,
        };

        const token = jwt.sign(payload, config.jwtSecret);

        res.status(201).json({
          ok: true,
          data: user,
          token,
        });
      };

      res.json(googleUser);
    } catch (error) {
      next(error);
    };
  });
};

module.exports = {
  authApi,
};