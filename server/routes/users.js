const express = require('express');
const _ = require('underscore');

// Services
const { UsersService } = require('../services/users');
// Schemas
const { userSchema } = require('../utils/schemas/users');
const userApi = (app) => {
  const router = express.Router();
  app.use('/users', router);

  router.get('/', (req, res) => {
    res.send('from get');
  });

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
      res.status(200).json({
        ok: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }

  })
};

module.exports = {
  userApi,
};