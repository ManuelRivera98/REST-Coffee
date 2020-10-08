const express = require('express');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Conf
const { config } = require('../config');
// Services
const { UsersService } = require('../services/users');
// Schemas
const { userSchema } = require('../utils/schemas/users');

const authApi = (app) => {
  const router = express.Router();
  app.use('/auth', router);

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

    // Instance service
    const userService = new UsersService();

    if (!email || !password) return next(boom.unauthorized('Email and password are require.'));

    try {
      const users = await userService.getUsers(userSchema, {}, email);
      const user = users.values[0];

      if (!user) return next(boom.badRequest('Wrong email or password.'));

      const passwordIsValid = await bcrypt.compare(password, user.password);

      if (!passwordIsValid) return next(boom.unauthorized('Wrong email or password.'));

      const payload = {
        sub: user._id,
        name: user.name,
        email: user.email,
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
  })
};

module.exports = {
  authApi,
};