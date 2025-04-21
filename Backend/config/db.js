// const mysql = require("mysql2");

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
//   multipleStatements: true,
// });

// module.exports = db;

const mysql = require("mysql2");

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Test_1234',
    database: 'sowapplicationDB',
  multipleStatements: true,
});

module.exports = db;
