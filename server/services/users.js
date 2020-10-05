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
    const user = await this.mongoDB.update(this.collection, schema, id, data);
    return user || {};
  };
};

module.exports = {
  UsersService,
};