require('dotenv').config()
const mysql = require('mysql2/promise');
const {HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE, SQLPORT} = process.env;
const pool = mysql.createPool({
    host: HOST,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: SQLPORT,
    connectionLimit: 500,
    acquireTimeout: 300000
});

console.log('pool = ' + pool + '\n');
module.exports = pool