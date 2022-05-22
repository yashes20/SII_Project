"use strict";

// Use of the mysql
const mysql = require("mysql2");
const options = require("./connection-options.json");

// Creation of the querys for the CRUD functionalities
const queryCategories = "SELECT categoryId, categoryName from categories";
const queryUsers = "SELECT userId, userFullName, userName,  DATE_FORMAT(userBirthDate,'%Y-%m-%d') AS userBirthDate, userAddress, userZipCode, userEmail, userGender, userPhone  FROM users WHERE userState ='A'";
const queryNewTasks = "SELECT taskId, taskName, taskDescription,taskDateCreation, status.statusName AS taskStatus, taskDateStatus, taskCategoryId,userCreation, userAssignment, taskAddress, taskLatitude,taskLongitude from tasks INNER JOIN status ON tasks.taskStatusId = status.statusId where  tasks.taskStatusId = 1";
const queryTasksByUserId = "SELECT taskId, taskName, taskDescription,taskDateCreation, taskStatus, taskDateStatus, taskCategoryId,userCreation, taskAddress, taskLatitude,taskLongitude from tasks where userCreation = ? and taskStatus = ?";

const sqlUpdateUserPass = "UPDATE USERS SET userFullName = ?, userName = ?, userPassword = md5(?), userAddress = ?, userZipCode= ? , userEmail = ? , userGender = ?,  userPhone = ?, userBirthDate = ? WHERE userId = ?";
const sqlUpdateUser = "UPDATE USERS SET userFullName = ?, userName = ?, userAddress = ?, userZipCode= ? , userEmail = ? , userGender = ?,  userPhone = ?, userBirthDate = ? WHERE userId = ?";
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
 * Function to get all categories
 * 
 * @param {*} req - Variable with the request body
 * @param {*} res - Variable with the response 
 */
 function selectCategories(req, res){
    createConnectionToDb(req, res, queryCategories, "categories");
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
 * This function is used to update an existing user or create a new one based on the param "isUpdate"
 * 
 * @param {*} formUser - form with data about the user
 * @param {*} isUpdate - if the operation is to update or create a new data
 * @param {*} result - result from the execution of the query
 */
 async function createUpdateUser(formUser, isUpdate, result) {
    // Declaration of variables
    const connection = await connect();
    let id = formUser.id;
    let fullName = formUser.fullName;
    let username = formUser.username;
    let address = formUser.address;
    let zipCode = formUser.zipCode;
    let email = formUser.email;
    let gender = formUser.gender;
    let phone = formUser.phone;
    let birthdate = formUser.birthDate;

    let sqlUpdate = sqlUpdateUser;
    let password = formUser.password;

    // Check if is update or not
    if (isUpdate) {
        if (password != null) {
            sqlUpdate = sqlUpdateUserPass;
        }
    }

    // If is update use the sqlUpdate query created above otherwise execute the insert query
    let sql = (isUpdate) ? sqlUpdate : "INSERT INTO users(userFullName, userName, userPassword, userAddress, userZipCode,  userEmail, userGender, userPhone, userBirthDate,userState,userType) VALUES (?,?,md5(?),?,?,?,?,?,?,'A','User')";
    connection.connect(function (err) {
        if (err) {
            if (result != null) {
                result(err, null, null);
            }
            else {
                throw err;
            }
        }
        else {
            // Insertion of the data in the following params
            let params = password != null ? [fullName, username, password, address, zipCode, email, gender, phone, birthdate,  id] : [fullName, username, address, zipCode, email, gender, phone, birthdate, id];

            connection.query(sql, params, function (err, rows, results) {
                if (err) {
                    if (result != null) {
                        result(err, null, null);
                    }
                    else {
                        throw err;
                    }
                } else {
                    result(err, rows, results);
                }
            });
        }
    });
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

 /**
 * This function is used to create a new task
 * @param {*} task - variable with all the data related to the task
 * @param {*} result - result from the execution of the query
 */
  async function createTask(postTask, result) {
    // Declaration of variables
    const connection = await connect();
    let name = postTask.name;
    let description = postTask.description;
    let category = postTask.category;
    let userCreation = postTask.userCreation;
    let address = postTask.address;
    let taskLatitude = postTask.taskLatitude;
    let taskLongitude = postTask.taskLongitude;

    
    // insert
    let sql ="INSERT INTO tasks(taskName, taskDescription, taskDateCreation, taskStatusId, taskDateStatus, taskCategoryId,taskIsEnabled,userCreation,taskAddress,taskLatitude,taskLongitude) VALUES (?,?,NOW(),1,NOW(),?,1,?,?,?,?)";
    connection.connect(function (err) {
        if (err) {
            if (result != null) {
                result(err, null, null);
            }
            else {
                throw err;
            }
        }
        else {
            // Insertion of the data in the following params
            connection.query(sql, [name, description, category, userCreation, address, taskLatitude, taskLongitude], function (err, rows, results) {
                if (err) {
                    if (result != null) {
                        result(err, null, null);
                        console.log("erro aqui");
                    }
                    else {
                        console.log("erro aqui2");
                        throw err;
                    }
                } else {
                    console.log("sucesso aqui3");
                    result(err, rows, results);
                }
            });
        }
    });
}

module.exports = {selectCategories,selectUsers,createUpdateUser,selectNewTasks, selectTasksByUserid,createTask}