const { Schema } = require('mongoose');

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  products: [{ type: Schema.Types.ObjectId, ref: 'product' }],
  user_id: { type: Schema.Types.ObjectId, ref: 'user' },
  status: {
    type: Boolean,
    default: true,
  },
  created: Date,
  modified: Date,
});

module.exports = {
  categorySchema,
};