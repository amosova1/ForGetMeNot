require('dotenv').config();

module.exports = {
  session: {
    cookieName: 'forgetmenot',
  },
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'tonka',
    database: process.env.DB_NAME || 'forgetmenot',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres',
  },
  test: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'tonka',
    database: process.env.DB_NAME || 'forgetmenot_test',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
  }
};
