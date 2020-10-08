const { MongoLib } = require('../lib/mongo');
const bcrypt = require('bcrypt');

class UsersService {
  constructor() {
    this.collection = 'user';
    this.mongoDB = new MongoLib();
  }

  async createUser(data, userSchema) {
    const { password } = data;
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newData = { ...data, password: encryptedPassword };
    const user = await this.mongoDB.create(this.collection, userSchema, newData);
    return user || {};
  };

  async updateUser(id, data, schema) {
    const user = await this.mongoDB.update(this.collection, schema, id, data, { status: true });
    return user || {};
  };

  async getUsers(schema, conditions, email = false) {
    // Add values that we are going to return
    const addConditions = {
      ...conditions,
      returnValues: 'name email google role password',
    };

    const query = email ? { email, status: true, } : { status: true, };
    const users = await this.mongoDB.getAll(this.collection, schema, addConditions, query);
    return users;
  };

  async getUser(id, schema) {
    const conditions = { returnValues: 'name email google role' }
    const user = await this.mongoDB.get(this.collection, schema, id, conditions, { status: true });
    return user || {};
  };

  async deleteUser(id, schema) {
    const user = await this.mongoDB.delete(this.collection, schema, id);
    return user || {};
  };
};

module.exports = {
  UsersService,
};