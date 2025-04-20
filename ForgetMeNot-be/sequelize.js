const { Sequelize } = require("sequelize");
const process = require('process');

const env = process.env.NODE_ENV || 'development';
const config = require('./config/config.js');

const dbConfig = config[env];

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: dbConfig.dialect,
    }
);
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connected to PostgreSQL database.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

module.exports = { sequelize, connectDB };
