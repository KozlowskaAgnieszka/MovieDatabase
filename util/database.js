const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'bambino',
  password: 'P4ssword',
});

module.exports = pool.promise();
