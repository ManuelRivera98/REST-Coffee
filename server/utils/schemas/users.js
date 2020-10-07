const { Schema } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const rolesValidate = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: 'This {VALUE} isn\'t an allowed value.',
};

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'The field name is require.'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'This field is require.'],
  },
  password: {
    type: String,
    required: [true, 'The field password is require.'],
    select: false,
  },
  img: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    default: 'USER_ROLE',
    enum: rolesValidate,
  },
  google: {
    type: Boolean,
    default: false,
  },
  status: {
    type: Boolean,
    default: true,
  }
}, { strictQuery: true });

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();

  delete userObject.password;

  return userObject;
};

userSchema.plugin(uniqueValidator, { message: 'Another user is already using this {PATH}, try another' })

module.exports = {
  userSchema,
};