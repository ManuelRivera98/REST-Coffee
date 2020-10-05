// DEBUG=app:* node scripts/seedUsers.js

const colors = require('colors/safe');
const bcrypt = require('bcrypt');
const debug = require('debug')('app:scripts:users');
const { MongoLib } = require('../lib/mongo');
const { users } = require('../utils/mocks/users');
const { userSchema } = require('../utils/schemas/users');

async function createUser(mongoDB, user) {
  const { password } = user;
  const encryptedPassword = await bcrypt.hash(password, 10);
  const data = { ...user, password: encryptedPassword };

  const docUser = await mongoDB.create('user', userSchema, data);
  return docUser._id;
};

async function seedUsers() {
  try {
    const mongoDB = new MongoLib();

    const promises = users.map(async user => {
      const userId = await createUser(mongoDB, user);
      debug(colors.green(`User created with id: ${userId}`));
    });

    await Promise.all(promises);
    return process.exit(0);
  } catch (error) {
    debug(colors.red(error));
    process.exit(1);
  };
};

seedUsers();