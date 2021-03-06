const express = require('express');
const boom = require('@hapi/boom');
const _ = require('underscore');

const { config } = require('../config');

// Services
const { UsersService } = require('../services/users');
// Schemas
const { userSchema } = require('../utils/schemas/users');
// Middleware
const { jwtAuthentication, jwtAuthenticationParams } = require('../utils/middleware/authentication');
const { scopesValidationHandler } = require('../utils/middleware/scopesValidationHandler');

const userApi = (app) => {
  const router = express.Router();
  app.use('/users', router);

  // Instance service
  const userService = new UsersService();

  router.get('/',
    jwtAuthentication,
    scopesValidationHandler(['read:users']),
    async (req, res, next) => {

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

  router.get('/:id',
    jwtAuthentication,
    scopesValidationHandler(['read:user']),
    async (req, res, next) => {
      const { id } = req.params;

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

  router.put('/:id',
    jwtAuthentication,
    scopesValidationHandler(['update:users']),
    async (req, res, next) => {
      const { id } = req.params;
      const { body } = req;

      // Remove extra values
      const data = _.pick(body, ['name', 'email', 'role', 'img', 'status']);

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

  router.delete('/:id',
    jwtAuthentication,
    scopesValidationHandler(['delete:users']),
    async (req, res, next) => {
      const { id } = req.params;

      try {
        const user = await userService.deleteUser(id, userSchema);
        const values = Object.keys(user);

        if (user.id === config.invalidIdMessage) return next(boom.badData('Invalid id.'));
        if (values.length === 0) return next(boom.badRequest('Username does not exist.'));

        res.status(204).json({
          ok: true,
          data: user,
        });

      } catch (error) {
        next(error);
      };
    });

  router.put('/image/:id',
    jwtAuthentication,
    scopesValidationHandler(['update:images']),
    async (req, res, next) => {
      const { id } = req.params;

      if (!req.files || Object.keys(req.files).length === 0) return next(boom.badRequest('No files we are uploaded.'));
      const { img } = req.files;
      try {
        const response = await userService.updateImg(id, userSchema, img);

        if (!response.ok) return next(boom.badRequest(response.message));

        res.status(200).json(response);
      } catch (error) {
        next(error);
      };
    });

  router.get('/image/:nameImg',
    jwtAuthenticationParams,
    scopesValidationHandler(['read:images']),
    async (req, res, next) => {
      const { nameImg } = req.params;
      try {
        const Img = await userService.getImage(nameImg);

        res.status(200).sendFile(Img);
      } catch (error) {
        next(error);
      };
    })

};

module.exports = {
  userApi,
};