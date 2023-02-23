const mysql = require('mysql2');
require('dotenv').config();
const con = mysql.createConnection({
  host: process.env.dbhost || 'localhost',
  user: process.env.dbuser || 'root',
  password: process.env.dbpass || 'root',
  database: process.env.dbdatabase || 'vtuber'
});

module.exports = {con};