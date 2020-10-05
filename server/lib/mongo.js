const mongoose = require('mongoose');

class MongoLib {
  constructor() {
    this.client = mongoose;
  }

  async connect() {
    const client = await this.client.connect('mongodb://localhost:27017/coffee', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });
    console.log('DB connected.');
  }

  async create(collection, schema, data) {
    const Model = this.client.model(collection, schema);

    await this.connect();
    const doc = await Model.create(data);
    return doc;

  }

  async update(collection, schema, query, data) {
    const Model = this.client.model(collection, schema);

    await this.connect();
    const doc = await Model.findByIdAndUpdate(query, data, { new: true, runValidators: true, });
    return doc;
  }
}

module.exports = {
  MongoLib,
};