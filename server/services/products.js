const { MongoLib } = require('../lib/mongo');

class ProductService {
  constructor() {
    this.mongoDB = new MongoLib();
    this.collection = 'product';
  }

  async createProduct(data, schema, user_id) {
    const newData = { ...data, user_id, };
    const product = await this.mongoDB.create(this.collection, schema, newData);
    return product;
  };

  async getProducts(schemas, conditions) {
    // Add values that we are to return
    const addConditions = {
      ...conditions,
      returnValues: 'name price user_id category_id',
    };
    const { productSchema, userSchema, categorySchema, } = schemas;
    const dataPopulate = {
      collection: 'user',
      schema: userSchema,
      path: 'user_id',
    };

    const dataPopulate2 = {
      collection: 'category',
      schema: categorySchema,
      path: 'category_id',
    };

    const query = {
      status: true,
    };

    if (conditions.search) {
      const regex = new RegExp(conditions.search, 'i');
      query.name = regex;
    };

    const products = await this.mongoDB.getAll(this.collection, productSchema, addConditions, query, dataPopulate, dataPopulate2);
    return products;
  };

  async getProduct(id, schemas) {
    const { userSchema, categorySchema, productSchema } = schemas;
    const conditions = { returnValues: 'name price user_id category_id' };
    const dataPopulate = {
      collection: 'user',
      schema: userSchema,
      path: 'user_id',
    };
    const dataPopulate2 = {
      collection: 'category',
      schema: categorySchema,
      path: 'category_id',
    };

    const product = await this.mongoDB.get(this.collection, productSchema, id, conditions, { status: true, }, dataPopulate, dataPopulate2);
    return product || {};
  };

  async updateProduct(id, data, schemas) {
    const { userSchema, categorySchema, productSchema } = schemas;
    const dataPopulate = {
      collection: 'user',
      schema: userSchema,
      path: 'user_id',
    };
    const dataPopulate2 = {
      collection: 'category',
      schema: categorySchema,
      path: 'category_id',
    };
    const product = await this.mongoDB.update(this.collection, productSchema, id, data, { status: true }, dataPopulate, dataPopulate2);
    return product || {};
  };

  async removeProduct(id, schema) {
    const product = await this.mongoDB.delete(this.collection, schema, id);
    return product || {};
  };
};

module.exports = {
  ProductService,
};