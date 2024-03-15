const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool({
    user: config.USER,
    host: config.HOST,
    database: config.DATABASE,
    password: config.PASSWORD,
    port: config.DBPORT,
    max: 200,
    idleTimeoutMillis: 30000
});

module.exports = { pool, config };
