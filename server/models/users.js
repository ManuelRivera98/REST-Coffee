const mongoose = require('mongoose');

// Schemas
const { userSchema } = require('../utils/schemas/users');

const UserModel = mongoose.model('user', userSchema);

module.exports = {
  UserModel,
};