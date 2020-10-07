require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  dev: process.env.NODE_ENV !== 'production',
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  dbLocalHost: process.env.DB_LOCAL_HOST,
  invalidIdMessage: 'Invalid id.',
};

module.exports = {
  config,
};