const { Schema } = require('mongoose');

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  img: String,
  category_id: { type: Schema.Types.ObjectId, ref: 'category', required: true, },
  user_id: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  created: Date,
  modified: Date,
});

module.exports = {
  productSchema,
};