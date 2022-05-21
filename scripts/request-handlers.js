"use strict";

// Use of the mysql
const mysql = require("mysql2");
const options = require("./connection-options.json");

// Creation of the querys for the CRUD functionalities
const queryUsers = "SELECT userId, userFullName, userName,  DATE_FORMAT(userBirthDate,'%Y-%m-%d') AS userBirthDate, userAddress, userZipCode, userEmail, userGender, userPhone  FROM users WHERE userState ='A'";
const queryNewTasks = "SELECT taskId, taskName, taskDescription,taskDateCreation, taskStatus, taskDateStatus, taskCategoryId,userCreation,taskAddress, taskLatitude,taskLongitude from tasks where taskStatus = 'New'";
const queryTasksByUserId = "SELECT taskId, taskName, taskDescription,taskDateCreation, taskStatus, taskDateStatus, taskCategoryId,userCreation,taskAddress, taskLatitude,taskLongitude from tasks where userCreation = ? and taskStatus = ?";

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
    } else if (typeColumn === "tasks" || typeColumn === "task") {
        res.json({ "message": "success", "task": rows });
    }
}

async function createConnectionToDb(req, res, query, typeColumn) {
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

/**
 * Function to get all new tasks
 * 
 * @param {*} req - Variable with the request body
 * @param {*} res - Variable with the response 
 */
 function selectNewTasks(req, res){
    createConnectionToDb(req, res, queryNewTasks, "task");
 }

/**
 * Function to get tasks by creation user id
 * 
 * @param {*} req - Variable with the request body
 * @param {*} res - Variable with the response 
 */
 function selectTasksByUserid(req, res){
    createConnectionToDb(req, res, queryTasksByUserId, "task");
 }

module.exports = {selectUsers,selectNewTasks, selectTasksByUserid}