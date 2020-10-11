const { format } = require('date-fns');
// Lib
const { MongoLib } = require('../lib/mongo');

class CategoryService {
  constructor() {
    this.collection = 'category';
    this.mongoDB = new MongoLib();
  }

  async createCategory(data, schema, user_id) {
    const date = new Date();
    const newData = { ...data, user_id, created: format(date, 'dd-MM-yyyy'), modified: format(date, 'dd-MM-yyyy') };
    const category = await this.mongoDB.create(this.collection, schema, newData);
    return category;
  };

  async getCategories(schemas, conditions) {
    // Add values that we are to return
    const addConditions = {
      ...conditions,
      returnValues: 'name user_id products'
    }
    const { userSchema, categorySchema } = schemas;
    const dataPopulate = {
      collection: 'user',
      schema: userSchema,
      path: 'user_id',
    };
    const query = { status: true, };

    if (conditions.search) {
      const regex = new RegExp(conditions.search, 'i');
      query.name = regex;
    };

    const categories = await this.mongoDB.getAll(this.collection, categorySchema, addConditions, query, dataPopulate);
    return categories;
  };

  async getCategory(id, schemas) {
    const { userSchema, categorySchema } = schemas;
    const conditions = { returnValues: 'name user_id products', };
    const dataPopulate = {
      collection: 'user',
      schema: userSchema,
      path: 'user_id',
    };
    const category = await this.mongoDB.get(this.collection, categorySchema, id, conditions, { status: true, }, dataPopulate);
    return category || {};
  };

  async updateCategory(id, data, schemas) {
    const { userSchema, categorySchema } = schemas;
    const dataPopulate = {
      collection: 'user',
      schema: userSchema,
      path: 'user_id',
    };
    const addData = {
      ...data,
      modified: format(new Date(), 'dd-MM-yyyy'),
    };
    const category = await this.mongoDB.update(this.collection, categorySchema, id, addData, { status: true }, dataPopulate);
    return category || {};
  };

  async deleteCategory(id, schema) {
    const category = await this.mongoDB.delete(this.collection, schema, id);
    return category || {};
  };
}

module.exports = {
  CategoryService,
};