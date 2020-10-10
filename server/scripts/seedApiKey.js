// DEBUG=app:* node server/scripts/seedApiKey.js

const colors = require('colors/safe');
const crypto = require('crypto');
const debug = require('debug')('app:scripts:api-key');
// Services
const { MongoLib } = require('../lib/mongo');
// Schema
const { apiKeySchema } = require('../utils/schemas/apiKeys');

const adminScopes = [
  'login:auth',
  'signup:auth',
  'read:users',
  'read:user',
  'update:users',
  'delete:users',
  'create:category',
  'read:categories',
  'read:category',
  'update:category',
  'delete:category'
];

const publicScopes = [
  'login:auth',
  'signup:auth',
  'read:user',
  'read:categories',
  'read:category',
];

const apiKeys = [
  {
    token: generateRandomToken(),
    scopes: adminScopes,
  },
  {
    token: generateRandomToken(),
    scopes: publicScopes,
  },
];


function generateRandomToken() {
  const buffer = crypto.randomBytes(32);
  return buffer.toString('hex');
};

async function seedApiKey() {
  try {
    const mongoDB = new MongoLib();

    const promises = apiKeys.map(async apiKey => {
      await mongoDB.create('api-keys', apiKeySchema, apiKey);
    });

    await Promise.all(promises);
    debug(colors.green(`${promises.length} api keys have been created successfully.`));
    return process.exit(0);
  } catch (error) {
    debug(colors.red(error));
    process.exit(1);
  };
};

seedApiKey();
