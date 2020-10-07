const mongoose = require('mongoose');
const { config } = require('../config');

// Dev
const MONGO_URI = `mongodb+srv://${config.dbUser}:${config.dbPassword}${config.dbHost}/${config.dbName}?retryWrites=true&w=majority`;
// Prod
const URI_LOCAL = `mongodb://${config.dbLocalHost}/${config.dbName}`;
// Helpers
const { numberToString } = require('../utils/helpers/numberToString');

class MongoLib {
  constructor() {
    this.client = mongoose;
  }

  async connect() {
    if (!MongoLib.connection) {
      MongoLib.connection = await this.client.connect(config.dev ? URI_LOCAL : MONGO_URI, {
        useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true
      });
      console.log('DB connected.');
    };

    return MongoLib.connection;
  }

  async create(collection, schema, data) {
    const Model = this.client.model(collection, schema);

    await this.connect();
    const doc = await Model.create(data);
    return doc;

  }

  async update(collection, schema, id, data, conditions) {
    const Model = this.client.model(collection, schema);

    // state user on db.
    const { status = true } = conditions;

    const isValid = this.client.Types.ObjectId.isValid(id);

    if (!isValid) return { id: config.invalidIdMessage };

    await this.connect();
    const doc = await Model.findByIdAndUpdate(id, data, { new: true, runValidators: true, }).where({ status, });
    return doc;
  }

  async getAll(collection, schema, conditions) {
    const { from = 0, limit = 5, field, status = true, returnValues = '' } = conditions;
    const Model = this.client.model(collection, schema);

    // Converter and validation string to number
    const fromNumber = numberToString(from);
    const limitNumber = numberToString(limit);

    const fieldSort = {};
    fieldSort[field] = 1;

    await this.connect();
    const total = await Model.countDocuments({ status, });
    const docs = await Model.find({ status, }, returnValues, {
      skip: fromNumber ? fromNumber : 0, limit: limitNumber ? limitNumber : 5, sort: field ? fieldSort : {}
    }).exec();

    const response = {
      values: docs,
      total,
    }

    return response;
  };

  async get(collection, schema, id, conditions) {
    const Model = this.client.model(collection, schema);

    const { status = true, returnValues = '' } = conditions;

    const isValid = this.client.Types.ObjectId.isValid(id);

    if (!isValid) return { id: config.invalidIdMessage };

    await this.connect();
    const doc = await Model.findById(id, returnValues).where({ status, }).exec();
    return doc;
  };

  async delete(collection, schema, id) {
    const Model = this.client.model(collection, schema);

    const isValid = this.client.Types.ObjectId.isValid(id);

    if (!isValid) return { id: config.invalidIdMessage };

    await this.connect();
    const doc = await Model.findById(id).where({ status: true, });

    if (!doc) return undefined;

    doc.status = false;
    const docUpdated = await doc.save();

    return docUpdated;
  };
};

module.exports = {
  MongoLib,
};