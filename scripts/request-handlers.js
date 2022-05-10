"use strict";

// Use of the mysql
const mysql = require("mysql2");
const options = require("./connection-options.json");

// Creation of the querys for the CRUD functionalities
const queryUsers = "SELECT userId, userFullName, userName,  DATE_FORMAT(userBirthDate,'%Y-%m-%d') AS userBirthDate, userAddress, userZipCode, userEmail, userGender, userPhone  FROM users WHERE userState ='A'";


/**
 * Function to return the json message obtained from the connection to the database
 * @param {*} req 
 * @param {*} res 
 */

 async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;
    const connection = mysql.createConnection(options);
    console.log("Conectou no MySQL!");
    global.connection = connection;
    return connection;
 }

/**
* Function to create a connection to the database based on the selected query
* 
* @param {*} req - Variable with the request body
* @param {*} res - Variable with the response
* @param {*} query - Query to execute in the database
* @param {*} typeColumn - To know which response to obtain in the getJsonMessage function
*/

function getJsonMessage(err, rows, res, typeColumn) {
    if (err) {
        res.json({ "message": "error", "error": err });
    } else if (typeColumn === "categories") {
        res.json({ "message": "success", "category": rows });
    } else if (typeColumn === "users" || typeColumn === "user") {
        res.json({ "message": "success", "user": rows });
    } else if (typeColumn === "actions" || typeColumn === "action") {
        res.json({ "message": "success", "action": rows });
    }
}

async function createConnectionToDb(req, res, query, typeColumn) {
   /*  var connection = mysql.createConnection(options);
    connection.connect();

    if (typeColumn === "user" || typeColumn === "action") {
        connection.query(query, [req.params.id], function (err, rows) {
            getJsonMessage(err, rows, res, typeColumn);
        });
    }
    else {
        connection.query(query, function (err, rows) {
            getJsonMessage(err, rows, res, typeColumn);
        });
    } */
    const connection = await connect();
    
     const getData = async (cb) => {
        connection.query(query, function (err, rows) {
            res.end(cb(err, rows, res, typeColumn));
        });
    }
    getData(getJsonMessage); 
}

/**
 * Function to get all users
 * 
 * @param {*} req - Variable with the request body
 * @param {*} res - Variable with the response 
 */
function selectUsers(req, res){
   createConnectionToDb(req, res, queryUsers, "user");
}
 
module.exports = {selectUsers}