const express = require('express');
const boom = require('@hapi/boom');
const _ = require('underscore');
// Services
const { CategoryService } = require('../services/categories');
// Schemas
const { categorySchema } = require('../utils/schemas/categories');
const { userSchema } = require('../utils/schemas/users');
// Middleware
const { jwtAuthentication } = require('../utils/middleware/authentication');
const { scopesValidationHandler } = require('../utils/middleware/scopesValidationHandler');
// Conf
const { config } = require('../config');

const categoryApi = (app) => {
  const router = express.Router();
  app.use('/categories', router);

  // Instance service
  const categoryService = new CategoryService();

  router.post('/',
    jwtAuthentication,
    scopesValidationHandler(['create:category']),
    async (req, res, next) => {
      const { body: data } = req;
      // get middleware authentication.
      const id = req.user.sub;

      try {
        const category = await categoryService.createCategory(data, categorySchema, id);

        res.status(201).json({
          ok: true,
          data: category,
        });
      } catch (error) {
        next(error);
      };
    });

  router.get('/',
    jwtAuthentication,
    scopesValidationHandler(['read:categories']),
    async (req, res, next) => {
      const { query } = req
      const schemas = {
        userSchema,
        categorySchema,
      };
      try {
        const categories = await categoryService.getCategories(schemas, query,)

        res.status(200).json({
          ok: true,
          data: categories,
        });
      } catch (error) {
        next(error);
      };
    });

  router.get('/:id',
    jwtAuthentication,
    scopesValidationHandler(['read:category']),
    async (req, res, next) => {
      const { id } = req.params;

      const schemas = {
        userSchema,
        categorySchema,
      };

      try {
        const category = await categoryService.getCategory(id, schemas);
        const values = Object.keys(category);

        if (category.id === config.invalidIdMessage) return next(boom.badData('Invalid id.'));
        if (values.length === 0) return next(boom.badRequest('Category does not exist.'));

        res.status(200).json({
          ok: true,
          data: category,
        });
      } catch (error) {
        next(error);
      }
    });

  router.put('/:id',
    jwtAuthentication,
    scopesValidationHandler(['update:category']),
    async (req, res, next) => {
      const { id } = req.params;
      const { body } = req;

      // Remove extra values
      const data = _.pick(body, ['name']);

      const schemas = {
        userSchema,
        categorySchema,
      };

      try {
        const category = await categoryService.updateCategory(id, data, schemas);
        const values = Object.keys(category);

        if (category.id === config.invalidIdMessage) return next(boom.badData('Invalid id.'));
        if (values.length === 0) return next(boom.badRequest('Category does not exits.'));

        res.status(200).json({
          ok: true,
          data: category,
        });
      } catch (error) {
        next(error);
      };
    })

  router.delete('/:id',
    jwtAuthentication,
    scopesValidationHandler(['delete:category']),
    async (req, res, next) => {
      const { id } = req.params;
      try {
        const category = await categoryService.deleteCategory(id, categorySchema);
        const values = Object.keys(category);

        if (category.id === config.invalidIdMessage) return next(boom.badData('Invalid id.'));
        if (values.length === 0) return next(boom.badRequest('Category does not exist.'));

        res.status(204).json({
          ok: true,
          data: category,
        });
      } catch (error) {
        next(error);
      };
    });
};

module.exports = {
  categoryApi,
};