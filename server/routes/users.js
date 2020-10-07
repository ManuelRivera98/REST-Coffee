const express = require('express');
const boom = require('@hapi/boom');
const _ = require('underscore');

const { config } = require('../config');

// Services
const { UsersService } = require('../services/users');
// Schemas
const { userSchema } = require('../utils/schemas/users');
const userApi = (app) => {
  const router = express.Router();
  app.use('/users', router);

  router.get('/', async (req, res, next) => {
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

  router.get('/:id', async (req, res, next) => {
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
  })

  router.post('/', async (req, res, next) => {
    const { body: data } = req;

    // Instance service
    const userService = new UsersService();

    try {
      const user = await userService.createUser(data, userSchema);

      res.status(201).json({
        ok: true,
        data: user,
      })
    } catch (error) {
      next(error);
    };


  });

  router.put('/:id', async (req, res, next) => {
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

  router.delete('/:id', async (req, res, next) => {
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