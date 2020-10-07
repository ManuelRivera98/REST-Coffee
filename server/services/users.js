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
    // Just update user active.
    const conditions = { status: true };
    const user = await this.mongoDB.update(this.collection, schema, id, data, conditions);
    return user || {};
  };

  async getUsers(schema, conditions) {
    const addStatusConditions = {
      ...conditions,
      status: true, returnValues: 'name email google role'
    };
    const users = await this.mongoDB.getAll(this.collection, schema, addStatusConditions);
    return users;
  };

  async getUser(id, schema) {
    const conditions = { status: true, returnValues: 'name email google role' }
    const user = await this.mongoDB.get(this.collection, schema, id, conditions);
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