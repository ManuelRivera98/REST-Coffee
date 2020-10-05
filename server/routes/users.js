const express = require('express');
const bcrypt = require('bcrypt');
// Views
const { UserModel } = require('../models/users');

const userApi = (app) => {
  const router = express.Router();
  app.use('/users', router);

  router.get('/', (req, res) => {
    res.send('from get');
  });

  router.post('/', (req, res) => {
    const { body } = req;

    const user = new UserModel({
      name: body.name,
      email: body.email,
      password: bcrypt.hashSync(body.password, 10),
      role: body.role,
    });

    user.save((error, userDB) => {
      if (error) {
        return res.status(400).json({
          ok: false,
          errors: error,
        });
      }

      res.status(201).json({
        ok: true,
        data: userDB,
      });
    });
  });

  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { body } = req;

  })
};

module.exports = {
  userApi,
};