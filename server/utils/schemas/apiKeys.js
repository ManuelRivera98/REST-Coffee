const { Schema } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const apiKeySchema = new Schema({
  token: {
    type: String,
    required: [true, 'The field token is require.'],
  },
  scopes: {
    type: [String],
    default: [],
  },
});

apiKeySchema.plugin(uniqueValidator, { message: 'The {PATH} must be unique.' });

module.exports = {
  apiKeySchema,
};