const express = require('express');
const boom = require('@hapi/boom');
const _ = require('underscore');

const { config } = require('../config');

// Services
const { UsersService } = require('../services/users');
// Schemas
const { userSchema } = require('../utils/schemas/users');
// Middleware
const { jwtAuthentication } = require('../utils/middleware/authentication');

const userApi = (app) => {
  const router = express.Router();
  app.use('/users', router);

  router.get('/', jwtAuthentication, async (req, res, next) => {
    // Instance service
    const userService = new UsersService();

    const { query } = req;
    try {
      const users = await userService.getUsers(userSchema, query);

      res.status(200).json({
        ok: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  });

  router.get('/:id', jwtAuthentication, async (req, res, next) => {
    const { id } = req.params;

    // Instance service
    const userService = new UsersService();

    try {
      const user = await userService.getUser(id, userSchema);
      const values = Object.keys(user);

      if (user.id === config.invalidIdMessage) return next(boom.badData('Invalid id.'));
      if (values.length === 0) return next(boom.badRequest('Username does not exist.'));

      res.status(200).json({
        ok: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  });

  router.put('/:id', jwtAuthentication, async (req, res, next) => {
    const { id } = req.params;
    const { body } = req;

    // Remove extra values
    const data = _.pick(body, ['name', 'email', 'role', 'img', 'status']);

    // Instance service
    const userService = new UsersService();

    try {
      const user = await userService.updateUser(id, data, userSchema);
      const values = Object.keys(user)

      if (user.id === config.invalidIdMessage) return next(boom.badData('Invalid id.'));
      if (values.length === 0) return next(boom.badRequest('Username does not exist.'));

      res.status(200).json({
        ok: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }

  });

  router.delete('/:id', jwtAuthentication, async (req, res, next) => {
    const { id } = req.params;

    // Instance service
    const userService = new UsersService();

    try {
      const user = await userService.deleteUser(id, userSchema);
      const values = Object.keys(user);

      if (user.id === config.invalidIdMessage) return next(boom.badData('Invalid id.'));
      if (values.length === 0) return next(boom.badRequest('Username does not exist.'));

      res.status(200).json({
        ok: true,
        data: user,
      });

    } catch (error) {
      next(error);
    };
  })
};

module.exports = {
  userApi,
};