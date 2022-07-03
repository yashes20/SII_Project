"use strict";

// Use of the mysql
const mysql = require("mysql2");
//const options = require("./connection-options.json");
const env = process.env.NODE_ENV || 'development';
const options = require(__dirname + '/../config/config.json')[env];

// Creation of the querys for the CRUD functionalities
const queryCategories = "SELECT categoryId, categoryName from categories";
const queryStatus = "SELECT statusId, statusName from status"; // somente status dos users
const queryUsers = "SELECT userId, userFullName,  DATE_FORMAT(userBirthDate,'%Y-%m-%d') AS userBirthDate, userAddress, userZipCode, userEmail, userGender, userPhone  FROM users WHERE userState ='A'";
const queryUser = "SELECT userId, userFullName,  DATE_FORMAT(userBirthDate,'%Y-%m-%d') AS userBirthDate, userAddress, userZipCode, userEmail, userGender, userPhone  FROM users WHERE userId = ?";

const queryAllTasks = "SELECT taskId, taskName, taskDescription,taskDateCreation, taskStatusId,"+ 
"taskDateStatus, taskCategoryId, taskIsEnabled, userCreation,"+
"userAssignment, DATE_FORMAT(taskDateAssignment,'%Y-%m-%d %H:%i') as taskDateAssignment, taskAddress, taskLatitude,taskLongitude "+
"from tasks "+
"INNER JOIN status ON tasks.taskStatusId = status.statusId "+
"INNER JOIN categories ON tasks.taskCategoryId = categories.categoryId "+
"INNER JOIN users AS USERS1 ON tasks.userCreation = USERS1.userId "+
"left JOIN users as USERS2 ON tasks.userAssignment = USERS2.userId "+
"where tasks.taskIsEnabled = 1";

const queryTaskStatus = "SELECT taskId, taskName, taskDescription,taskDateCreation, taskStatusId,"+ 
"taskDateStatus, taskCategoryId, taskIsEnabled, userCreation,"+
"userAssignment, DATE_FORMAT(taskDateAssignment,'%Y-%m-%d %H:%i') as taskDateAssignment,  taskAddress, taskLatitude,taskLongitude "+
"from tasks "+
"INNER JOIN status ON tasks.taskStatusId = status.statusId "+
"INNER JOIN categories ON tasks.taskCategoryId = categories.categoryId "+
"INNER JOIN users AS USERS1 ON tasks.userCreation = USERS1.userId "+
"left JOIN users as USERS2 ON tasks.userAssignment = USERS2.userId "+
"where tasks.taskStatusId = ? and tasks.taskIsEnabled = 1 ";


const queryTaskUserId = "SELECT taskId, taskName, taskDescription,taskDateCreation, taskStatusId,"+ 
"taskDateStatus, taskCategoryId, taskIsEnabled, userCreation,"+
"userAssignment, DATE_FORMAT(taskDateAssignment,'%Y-%m-%d %H:%i') as taskDateAssignment, taskAddress, taskLatitude,taskLongitude "+
"from tasks "+
"INNER JOIN status ON tasks.taskStatusId = status.statusId "+
"INNER JOIN categories ON tasks.taskCategoryId = categories.categoryId "+
"INNER JOIN users AS USERS1 ON tasks.userCreation = USERS1.userId "+
"left JOIN users as USERS2 ON tasks.userAssignment = USERS2.userId "+
"where tasks.userCreation = ? and tasks.taskIsEnabled = 1 ";

const queryTaskId = "SELECT taskId, taskName, taskDescription,taskDateCreation, taskStatusId,"+ 
"taskDateStatus, taskCategoryId, taskIsEnabled, userCreation,"+
"userAssignment, DATE_FORMAT(taskDateAssignment,'%Y-%m-%d %H:%i') as taskDateAssignment, taskAddress, taskLatitude,taskLongitude "+
"from tasks "+
"INNER JOIN status ON tasks.taskStatusId = status.statusId "+
"INNER JOIN categories ON tasks.taskCategoryId = categories.categoryId "+
"INNER JOIN users AS USERS1 ON tasks.userCreation = USERS1.userId "+
"left JOIN users as USERS2 ON tasks.userAssignment = USERS2.userId "+
"where tasks.taskId = ? and tasks.taskIsEnabled = 1 ";

const sqldeleteTask = "UPDATE TASKS SET taskIsEnabled = 0 WHERE taskId = ?";

const sqlUpdateUser = "UPDATE USERS SET userFullName = ?, userGender = ? ";
const sqlInsertUser = "INSERT INTO USERS (userFullName , userPassword, userGender, userEmail, userState, userType) VALUES (?,?,?,?,'A','User')";
const sqlWhereUpdateUser = " WHERE userId = ?";
const sqldeleteUser = "UPDATE USERS SET userState = 'I' WHERE userId = ?";
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
    } else if (typeColumn === "tasks" || typeColumn === "task")  {
        res.json({ "message": "success", "task": rows });
    } else if (typeColumn === "status" ) {
        res.json({ "message": "success", "status": rows });
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

async function createConnectionToDbP(req, res, query, typeColumn) {
    const connection = await connect();
    
    const getData =  (cb) => {
        connection.query(query, req.params.id , function (err, rows) {
            res.end(cb(err, rows, res, typeColumn));
        });
    }
    getData(getJsonMessage); 
}
/**
 * Function to get all status
 * 
 * @param {*} req - Variable with the request body
 * @param {*} res - Variable with the response 
 */
 function selectqueryStatus(req, res){
    createConnectionToDb(req, res, queryStatus, "status");
 }

 /**
 * Function to get all user categories
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

function selectUser(req, res){
    createConnectionToDbP(req, res, queryUser, "user");
 }

/**
 * This function is used to insert a new user
 * 
 * @param {*} formUser - form with data about the user
 * @param {*} result - result from the execution of the query
 */
 async function insertUser(formUser, result) {
    // Declaration of variables
    const connection = await connect();
    let id = formUser.id;
    let fullName = formUser.fullName;
    let address = formUser.address;
    let zipCode = formUser.zipCode;
    let email = formUser.email;
    let gender = formUser.gender;
    let phone = formUser.phone;
    let birthdate = formUser.birthDate;
    let password = formUser.password;

    let sql = sqlInsertUser;
    let params = [fullName, password, gender, email];

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
 * This function is used to update an existing user
 * 
 * @param {*} formUser - form with data about the user
 * @param {*} result - result from the execution of the query
 */
 async function updateUser(formUser, result) {
    // Declaration of variables
    const connection = await connect();
    let id = formUser.id;
    let fullName = formUser.fullName;
    let address = formUser.address;
    let zipCode = formUser.zipCode;
    let email = formUser.email;
    let gender = formUser.gender;
    let phone = formUser.phone;
    let birthdate = formUser.birthDate;
    let password = formUser.password;

    let sql = sqlUpdateUser;
    let params = [fullName, gender];
    // Check if optionals fields are filled
    if (password.trim().length != 0) {
        sql = sql + ", userPassword = ? ";
        params.push(password);
    }
    if (address.trim().length != 0) {
        sql = sql + ", userAddress = ? ";
        params.push(address);
    }
    if (zipCode.trim().length != 0) {
        sql = sql + ", userZipCode = ? ";
        params.push(zipCode);
    }
    if (birthdate.trim().length != 0) {
        sql = sql + ", userBirthDate = ? ";
        params.push(birthdate);
    }
    if (phone.trim().length != 0) {
        sql = sql + ", userPhone = ? ";
        params.push(phone);
    }
    // update query
    sql = sql + sqlWhereUpdateUser;
    params.push(id);

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
 * This function is used to delete a existing user 
 * 
 * @param {*} id - id
 * @param {*} result - result from the execution of the query
 */
 async function deleteUser(id, result) {
    // Declaration of variables
    const connection = await connect();

    // update status
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
            connection.query(sqldeleteUser, id, function (err, rows, results) {
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
 function selectAllTasks(req, res){
    createConnectionToDb(req, res, queryAllTasks, "task");
 }

 /**
 * Function to get all new tasks by status
 * 
 * @param {*} req - Variable with the request body
 * @param {*} res - Variable with the response 
 */
  function selectTasksByStatus(req, res){
    createConnectionToDbP(req, res, queryTaskStatus, "task");
 }

 /**
 * Function to get all new tasks by user creation
 * 
 * @param {*} req - Variable with the request body
 * @param {*} res - Variable with the response 
 */
function selectTasksByUserId(req, res){
    createConnectionToDbP(req, res, queryTaskUserId, "task");
 }

 /**
 * Function to get task by task id
 * 
 * @param {*} req - Variable with the request body
 * @param {*} res - Variable with the response 
 */
function selectTasksById(req, res){
    createConnectionToDbP(req, res, queryTaskId, "task");
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
    let dateAssignment = postTask.dateAssignment;
    let address = postTask.address;
    let latitude = postTask.latitude;
    let longitude = postTask.longitude;

    
    // insert
    let sql ="INSERT INTO tasks(taskName, taskDescription, taskDateCreation, taskStatusId, taskDateStatus, taskCategoryId,taskIsEnabled,userCreation, taskDateAssignment, taskAddress,taskLatitude,taskLongitude) VALUES (?,?,NOW(),1,NOW(),?,1,?,?,?,?,?)";
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
            connection.query(sql, [name, description, category, userCreation, dateAssignment, address, latitude, longitude], function (err, rows, results) {
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

/**
 * This function is used to create a new task
 * @param {*} task - variable with all the data related to the task
 * @param {*} result - result from the execution of the query
 */
 async function updateTask(putTask, result) {
    // Declaration of variables
    const connection = await connect();
    let id = putTask.id;
    let name = putTask.name;
    let description = putTask.description;
    let status = putTask.status;
    let category = putTask.category;
    let userCreation = putTask.userCreation;
    let userAssignment = putTask.userAssignment;
    let dateAssignment = putTask.dateAssignment;
    let address = putTask.address;
    let latitude = putTask.latitude;
    let longitude = putTask.longitude;

    
    // UPDATE
    let sql ="UPDATE tasks SET taskName = ?, taskDescription = ?, taskStatusId = ?, taskDateStatus = NOW(), taskCategoryId = ?, userCreation = ?, userAssignment = ?, taskDateAssignment = ?, taskAddress = ?, taskLatitude = ?, taskLongitude = ? WHERE taskId = ? ";
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
            connection.query(sql, [name, description, status, category, userCreation, userAssignment, dateAssignment, address, latitude, longitude, id], function (err, rows, results) {
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

/**
 * This function is used to delete an existing task"
 * 
 * @param {*} id - id 
 * @param {*} result - result from the execution of the query
 */
 async function deleteTask(id, result) {
    // Declaration of variables
    const connection = await connect();

    // update status
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
            connection.query(sqldeleteTask, id, function (err, rows, results) {
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


module.exports =
 {selectqueryStatus,
 selectCategories,
 selectUsers,
 selectUser,
 insertUser,
 updateUser,
 deleteUser, 
 selectAllTasks, 
 selectTasksByStatus,
 selectTasksByUserId,
 selectTasksById,
 createTask,
 updateTask,
 deleteTask}