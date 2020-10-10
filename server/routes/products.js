const express = require('express');
const boom = require('@hapi/boom');
const _ = require('underscore');

// Services
const { ProductService } = require('../services/products');
// Schemas
const { productSchema } = require('../utils/schemas/products');
const { categorySchema } = require('../utils/schemas/categories');
const { userSchema } = require('../utils/schemas/users');
// Middleware
const { jwtAuthentication } = require('../utils/middleware/authentication');
const { scopesValidationHandler } = require('../utils/middleware/scopesValidationHandler');
// Conf
const { config } = require('../config');


const productApi = (app) => {
  const router = express.Router();
  app.use('/products', router);

  // Instance service
  const productService = new ProductService();

  router.post('/',
    jwtAuthentication,
    scopesValidationHandler(['create:product']),
    async (req, res, next) => {
      const { body: data } = req;
      // Get id user request
      const id = req.user.sub;

      try {
        const product = await productService.createProduct(data, productSchema, id);

        res.status(201).json({
          ok: true,
          data: product,
        });
      } catch (error) {
        next(error);
      };
    });

  router.get('/',
    jwtAuthentication,
    scopesValidationHandler(['read:products']),
    async (req, res, next) => {

      const { query } = req;

      const schemas = {
        userSchema,
        categorySchema,
        productSchema,
      };
      try {
        const products = await productService.getProducts(schemas, query);

        res.status(200).json({
          ok: true,
          data: products,
        });
      } catch (error) {
        next(error);
      };
    });

  router.get('/:id',
    jwtAuthentication,
    scopesValidationHandler(['read:product']),
    async (req, res, next) => {
      const { id } = req.params;

      const schemas = {
        userSchema,
        categorySchema,
        productSchema,
      };

      try {
        const product = await productService.getProduct(id, schemas);
        const values = Object.keys(product);

        if (product.id === config.invalidIdMessage) return next(boom.badData('Invalid id.'));
        if (values.length === 0) return next(boom.badRequest('product does not exist.'));

        res.status(200).json({
          ok: true,
          data: product,
        });
      } catch (error) {
        next(error);
      };
    });

  router.put('/:id',
    jwtAuthentication,
    scopesValidationHandler(['update:product']),
    async (req, res, next) => {
      const { id } = req.params;
      const { body } = req;

      // Remove extra values
      const data = _.pick(body, ['name price category_id']);

      const schemas = {
        userSchema,
        categorySchema,
        productSchema,
      };

      try {
        const product = await productService.updateProduct(id, data, schemas);
        const values = Object.keys(product);

        if (product.id === config.invalidIdMessage) return next(boom.badData('Invalid id.'));
        if (values.length === 0) return next(boom.badRequest('product does not exist.'));

        res.status(200).json({
          ok: true,
          data: product,
        });
      } catch (error) {
        next(error);
      };
    });

  router.delete('/:id',
    jwtAuthentication,
    scopesValidationHandler(['delete:product']),
    async (req, res, next) => {
      const { id } = req.params;

      try {
        const product = await productService.removeProduct(id, productSchema);
        const values = Object.keys(product);

        if (product.id === config.invalidIdMessage) return next(boom.badData('Invalid id.'));
        if (values.length === 0) return next(boom.badRequest('product does not exist.'));

        res.status(204).json({
          ok: true,
          data: product,
        });
      } catch (error) {
        next(error);
      };
    })
}

module.exports = {
  productApi,
};