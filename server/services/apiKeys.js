// Services
const { MongoLib } = require('../lib/mongo');
// Schemas
const { apiKeySchema } = require('../utils/schemas/apiKeys');
class ApiKeysService {
  constructor() {
    this.collection = 'api-keys';
    this.mongoDB = new MongoLib();
  };

  async getApiKey(token) {
    const apiKey = await this.mongoDB.getAll(this.collection, apiKeySchema, {}, { token, });
    return apiKey;
  };
};

module.exports = {
  ApiKeysService,
};