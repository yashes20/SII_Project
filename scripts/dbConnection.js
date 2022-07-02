var mysql = require('mysql2');
//const options = require("./connection-options.json");
const env = process.env.NODE_ENV || 'development';
const options = require(__dirname + '/../config/config.json')[env];

var conn = mysql.createConnection(options); 

conn.connect(function(err) {
  if (err) throw err;
  console.log('Database is connected successfully !');
});
module.exports = conn;