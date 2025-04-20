const { Pool } = require('pg');
require('dotenv').config()

const pool = new Pool(
    {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASS + "" || "tonka",
        port: process.env.DB_PORT,
    }
);

console.log(pool.password, process.env.DB_PASSWORD)

module.exports = pool;