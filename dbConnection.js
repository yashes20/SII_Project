var mysql = require('mysql2');
const options = require("./scripts/connection-options.json");
var conn = mysql.createConnection(options); 
 
conn.connect(function(err) {
  if (err) throw err;
  console.log('Database is connected successfully !');
});
module.exports = conn;