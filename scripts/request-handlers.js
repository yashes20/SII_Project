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

const queryAllTasks = "SELECT taskId, taskName, taskDescription,taskDateCreation, taskStatusId," +
    "taskDateStatus, taskCategoryId, taskIsEnabled, userCreation," +
    "userAssignment, DATE_FORMAT(taskDateAssignment,'%Y-%m-%d %H:%i') as taskDateAssignment, taskAddress, taskLatitude,taskLongitude " +
    "from tasks " +
    "INNER JOIN status ON tasks.taskStatusId = status.statusId " +
    "INNER JOIN categories ON tasks.taskCategoryId = categories.categoryId " +
    "INNER JOIN users AS USERS1 ON tasks.userCreation = USERS1.userId " +
    "left JOIN users as USERS2 ON tasks.userAssignment = USERS2.userId " +
    "where tasks.taskIsEnabled = 1";

const queryAllRequests = "SELECT requestId, requestIdVoluntary, requestIdTask,  cast(requestStatus as UNSIGNED) requestStatus FROM requests";

const queryAllRequestsByTaskId = "SELECT req.requestId, tasks.taskId, tasks.taskName,  users.userId, users.userFullName, users.userEmail, users.userPhone, cast(req.requestStatus as UNSIGNED) requestStatus, " +
    "(SELECT  IFNULL(round(sum(rating) / count(1)),0) "+
    " FROM ratings "+
    " WHERE ratings.ratingIdUser = users.userId ) rating " +
    "from requests req " +
    "INNER JOIN tasks ON tasks.taskId = req.requestIdTask " +
    "INNER JOIN users ON users.userId = req.requestIdVoluntary " +
    "where tasks.taskId = ? AND tasks.userAssignment is null";

const queryTaskStatus = "SELECT taskId, taskName, taskDescription,taskDateCreation, taskStatusId," +
    "taskDateStatus, taskCategoryId, taskIsEnabled, userCreation," +
    "userAssignment, DATE_FORMAT(taskDateAssignment,'%Y-%m-%d %H:%i') as taskDateAssignment,  taskAddress, taskLatitude,taskLongitude " +
    "from tasks " +
    "INNER JOIN status ON tasks.taskStatusId = status.statusId " +
    "INNER JOIN categories ON tasks.taskCategoryId = categories.categoryId " +
    "INNER JOIN users AS USERS1 ON tasks.userCreation = USERS1.userId " +
    "left JOIN users as USERS2 ON tasks.userAssignment = USERS2.userId " +
    "where tasks.taskStatusId = ? and tasks.taskIsEnabled = 1 ";


const queryTaskUserId = "SELECT taskId, taskName, taskDescription,taskDateCreation, taskStatusId," +
    "taskDateStatus, taskCategoryId, taskIsEnabled, userCreation," +
    "userAssignment, DATE_FORMAT(taskDateAssignment,'%Y-%m-%d %H:%i') as taskDateAssignment, taskAddress, taskLatitude,taskLongitude " +
    "from tasks " +
    "INNER JOIN status ON tasks.taskStatusId = status.statusId " +
    "INNER JOIN categories ON tasks.taskCategoryId = categories.categoryId " +
    "INNER JOIN users AS USERS1 ON tasks.userCreation = USERS1.userId " +
    "left JOIN users as USERS2 ON tasks.userAssignment = USERS2.userId " +
    "where tasks.userCreation = ? and tasks.taskIsEnabled = 1 ";

const queryTaskId = "SELECT taskId, taskName, taskDescription,taskDateCreation, taskStatusId," +
    "taskDateStatus, taskCategoryId, taskIsEnabled, userCreation," +
    "userAssignment, DATE_FORMAT(taskDateAssignment,'%Y-%m-%d %H:%i') as taskDateAssignment, taskAddress, taskLatitude,taskLongitude " +
    "from tasks " +
    "INNER JOIN status ON tasks.taskStatusId = status.statusId " +
    "INNER JOIN categories ON tasks.taskCategoryId = categories.categoryId " +
    "INNER JOIN users AS USERS1 ON tasks.userCreation = USERS1.userId " +
    "left JOIN users as USERS2 ON tasks.userAssignment = USERS2.userId " +
    "where tasks.taskId = ? and tasks.taskIsEnabled = 1 ";

const queryRatingUser = "select IFNULL(round(sum(rating) / count(1)),0) rating from ratings where ratingIdUser = ?"

const sqldeleteTask = "UPDATE TASKS SET taskIsEnabled = 0 WHERE taskId = ?";

const sqlTaskLatLong = "SELECT *, (6371 * acos(cos(radians(?)) * cos(radians(taskLatitude)) * cos(radians(?) - radians(taskLongitude)) + sin(radians(?)) * sin(radians(taskLatitude)))) AS distance FROM tasks HAVING distance <=  5 AND tasks.taskStatusId = 1";

/* SELECT *, (6371 *
    acos(
        cos(radians(-19.83996)) *
        cos(radians(taskLatitude)) *
        cos(radians(-43.94910) - radians(taskLongitude)) +
        sin(radians(-19.83996)) *
        sin(radians(taskLatitude))
    )) AS distance
FROM tasks HAVING distance <= 5"
 */
const sqlUpdateUser = "UPDATE USERS SET ";
const sqlInsertUser = "INSERT INTO USERS (userFullName , userPassword, userGender, userEmail, userState, userType) VALUES (?,?,?,?,'A','User')";
const sqlWhereUpdateUser = " WHERE userId = ?";
const sqldeleteUser = "UPDATE USERS SET userState = 'I' WHERE userId = ?";

async function connect() {
    if (global.connection && global.connection.state !== 'disconnected')
        return global.connection;
    const connection = mysql.createConnection(options);
    console.log("Conectou no MySQL!");
    global.connection = connection;
    return connection;
}

/**
 * 
* Function return a object json from database
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
    } else if (typeColumn === "status") {
        res.json({ "message": "success", "status": rows });
    } else if (typeColumn === "request") {
        res.json({ "message": "success", "request": rows });
    } else if (typeColumn === "rating") {
        res.json({ "message": "success", "rating": rows });
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

    const getData = (cb) => {
        connection.query(query, req.params.id, function (err, rows) {
            res.end(cb(err, rows, res, typeColumn));
        });
    }
    getData(getJsonMessage);
}

async function createConnectionCoord(req, res, query, typeColumn) {
    const connection = await connect();

    const getData = (cb) => {
        connection.query(query, [req.params.latitude, req.params.longitude, req.params.latitude], function (err, rows) {
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
function selectqueryStatus(req, res) {
    createConnectionToDb(req, res, queryStatus, "status");
}

/**
* Function to get all user categories
* 
* @param {*} req - Variable with the request body
* @param {*} res - Variable with the response 
*/
function selectCategories(req, res) {
    createConnectionToDb(req, res, queryCategories, "categories");
}

/**
 * Function to get all users
 * 
 * @param {*} req - Variable with the request body
 * @param {*} res - Variable with the response 
 */
function selectUsers(req, res) {
    createConnectionToDb(req, res, queryUsers, "user");
}

/**
 * Function to get user by id
 * 
 * @param {*} req - Variable with the request body
 * @param {*} res - Variable with the response 
 */

function selectUser(req, res) {
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
    let fullName = formUser.fullName;
    let email = formUser.email;
    let gender = formUser.gender;
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
    let gender = formUser.gender;
    let phone = formUser.phone;
    let birthdate = formUser.birthDate;
    let password = formUser.password;

    let sql = sqlUpdateUser;
    let params = [];
    // Check if optionals fields are filled

    if (fullName != undefined && fullName.trim().length != 0) {
        sql = sql + " userfullName = ? ";
        params.push(fullName);
    }

    if (gender != undefined && gender.trim().length != 0) {

        if (params.length > 0) {
            sql = sql + ",";
        }

        sql = sql + " userGender = ? ";
        params.push(gender);
    }

    if (password != undefined && password.trim().length != 0) {

        if (params.length > 0) {
            sql = sql + ",";
        }
        sql = sql + " userPassword = ? ";
        params.push(password);
    }
    if (address != undefined && address.trim().length != 0) {

        if (params.length > 0) {
            sql = sql + ",";
        }

        sql = sql + " userAddress = ? ";
        params.push(address);
    }
    if (zipCode != undefined && zipCode.trim().length != 0) {
        if (params.length > 0) {
            sql = sql + ",";
        }

        sql = sql + " userZipCode = ? ";
        params.push(zipCode);
    }
    if (birthdate != undefined && birthdate.trim().length != 0) {

        if (params.length > 0) {
            sql = sql + ",";
        }

        sql = sql + " userBirthDate = ? ";
        params.push(birthdate);
    }
    if (phone != undefined && phone.trim().length != 0) {

        if (params.length > 0) {
            sql = sql + ",";
        }

        sql = sql + " userPhone = ? ";
        params.push(phone);
    }
    // update query
    sql = sql + sqlWhereUpdateUser;
    params.push(id);

    if (params.length > 1) {
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
function selectAllTasks(req, res) {
    createConnectionToDb(req, res, queryAllTasks, "task");
}


function selectTasksFind(req, res) {
    let query = queryAllTasks;
    let taskStatusId = req.body.taskStatusId;
    let userAssignment = req.body.userAssignment;
    let userCreation = req.body.userCreation;

    if (taskStatusId) {
        query += " and tasks.taskStatusId IN(" + taskStatusId.join(",") + ")";
    }
    if (userAssignment) {
        query += " and tasks.userAssignment = " + userAssignment;
    }
    if (userCreation) {
        query += " and tasks.userCreation = " + userCreation;
    }
    createConnectionToDb(req, res, query, "task");
}

/**
* Function to get all new tasks by status
* 
* @param {*} req - Variable with the request body
* @param {*} res - Variable with the response 
*/
function selectTasksByStatus(req, res) {
    createConnectionToDbP(req, res, queryTaskStatus, "task");
}

/**
* Function to get all new tasks by user creation
* 
* @param {*} req - Variable with the request body
* @param {*} res - Variable with the response 
*/
function selectTasksByUserId(req, res) {
    createConnectionToDbP(req, res, queryTaskUserId, "task");
}

/**
* Function to get task by task id
* 
* @param {*} req - Variable with the request body
* @param {*} res - Variable with the response 
*/
function selectTasksById(req, res) {
    createConnectionToDbP(req, res, queryTaskId, "task");
}

/**
* Function get tasks by coordenates
* 
* @param {*} req - Variable with the request body
* @param {*} res - Variable with the response 
*/

function selectTasksByCoord(req, res) {
    createConnectionCoord(req, res, sqlTaskLatLong, "task");
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
    let sql = "INSERT INTO tasks(taskName, taskDescription, taskDateCreation, taskStatusId, taskDateStatus, taskCategoryId,taskIsEnabled,userCreation, taskDateAssignment, taskAddress,taskLatitude,taskLongitude) VALUES (?,?,NOW(),1,NOW(),?,1,?,?,?,?,?)";
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
                        console.log("err createTask connection.query");
                    }
                    else {
                        console.log("err createTask connection.query");
                        throw err;
                    }
                } else {
                    console.log("sucess createTask connection.query");
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
    let sql = "UPDATE tasks SET taskName = ?, taskDescription = ?, taskStatusId = ?, taskDateStatus = NOW(), taskCategoryId = ?, userCreation = ?, userAssignment = ?, taskDateAssignment = ?, taskAddress = ?, taskLatitude = ?, taskLongitude = ? WHERE taskId = ? ";
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
                        console.log("err updateTask connection.query");
                    }
                    else {
                        console.log("err updateTask connection.query");
                        throw err;
                    }
                } else {
                    console.log("sucess updateTask connection.query");
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


function selectAllRequests(req, res) {
    createConnectionToDb(req, res, queryAllRequests, "request");
}

function selectAllRequestsByTask(req, res) {
    createConnectionToDbP(req, res, queryAllRequestsByTaskId, "request");
}


async function createRequest(request, result) {
    // Declaration of variables
    const connection = await connect();
    let idVoluntary = request.idVoluntary;
    let idTask = request.idTask;
    let status = request.idStatus;

    // insert
    let sql = "INSERT INTO requests (requestIdVoluntary, requestIdTask, requestStatus) VALUES (?,?,?)";
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
            connection.query(sql, [idVoluntary, idTask, status], function (err, rows, results) {
                if (err) {
                    if (result != null) {
                        result(err, null, null);
                        console.log("err createRequest connection.query");
                    }
                    else {
                        console.log("err createRequest connection.query");
                        throw err;
                    }
                } else {
                    console.log("sucess createRequest connection.query");
                    result(err, rows, results);
                }
            });
        }
    });
}

/**
 * This function is used to update request with user assigment and task with the same user assigment
 * @param {*} request - variable with all the data related to the request
 * @param {*} result - result from the execution of the query
 */
async function updateRequest(putRequest, result) {
    // Declaration of variables
    const connection = await connect();
    let id = putRequest.id;

    // UPDATE
    let sql = "UPDATE requests SET requestStatus = 1 WHERE requestId = ? ";

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
            connection.query(sql, id, function (err, rows, results) {
                if (err) {
                    if (result != null) {
                        result(err, null, null);
                        console.log("err updateRequest connection.query");
                    }
                    else {
                        console.log("err updateRequest connection.query");
                        throw err;
                    }
                } else {
                    console.log("sucess updateRequest connection.query");
                    result(err, rows, results);
                }
            });


        }
    });
}

/**
 * This function is used to assignmentTask
 * @param {*} task - variable with all the data related to the task
 * @param {*} result - result from the execution of the query
 */
async function assignmentTask(assTask, result) {
    // Declaration of variables
    const connection = await connect();
    let id = assTask.idTask;
    let userAssignment = assTask.userAssignment;


    // UPDATE
    let sql = "UPDATE tasks SET taskStatusId = 2, taskDateStatus = NOW(), userAssignment = ? WHERE taskId = ? ";
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
            connection.query(sql, [userAssignment, id], function (err, rows, results) {
                if (err) {
                    if (result != null) {
                        result(err, null, null);
                        console.log("err assignmentTask connection.query");
                    }
                    else {
                        console.log("err assignmentTask connection.query");
                        throw err;
                    }
                } else {
                    console.log("sucess assignmentTask connection.query");
                    result(err, rows, results);
                }
            });
        }
    });
}

async function updateStatusTask(idTask, idStatus, result) {
    // Declaration of variables
    const connection = await connect();
    // UPDATE

    let sql = "";
    if (idStatus == 4 || idStatus == 5) {
        sql = "UPDATE tasks SET taskStatusId = ?, taskIsEnabled = 0 WHERE taskId = ? "
    } else {
        sql = "UPDATE tasks SET taskStatusId = ? WHERE taskId = ? "
    }
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
            connection.query(sql, [idStatus, idTask], function (err, rows, results) {
                if (err) {
                    if (result != null) {
                        result(err, null, null);
                        console.log("err updateStatusTask connection.query");
                    }
                    else {
                        console.log("err updateStatusTask connection.query");
                        throw err;
                    }
                } else {
                    console.log("sucess updateStatusTask connection.query");
                    result(err, rows, results);
                }
            });
        }
    });
}


async function updateUserPoints(idUser) {
    // Declaration of variables
    const connection = await connect();
    // UPDATE
    let sql = "UPDATE user SET taskStatusId = ? WHERE taskId = ? ";
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
            connection.query(sql, [idStatus, idTask], function (err, rows, results) {
                if (err) {
                    if (result != null) {
                        result(err, null, null);
                        console.log("err updateUserPoints connection.query");
                    }
                    else {
                        console.log("err updateUserPoints connection.query");
                        throw err;
                    }
                } else {
                    console.log("sucess updateUserPoints connection.query");
                    result(err, rows, results);
                }
            });
        }
    });
}

async function updateUserStatus(id, result) {
    let sql = "call updateUserPoints(?);";
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
            connection.query(sql, [id], function (err, rows, results) {
                if (err) {
                    if (result != null) {
                        result(err, null, null);
                        console.log("err updateUserStatus connection.query");
                    }
                    else {
                        console.log("err updateUserStatus connection.query");
                        throw err;
                    }
                } else {
                    console.log("sucess updateUserStatus connection.query");
                    result(err, rows, results);
                }
            });
        }
    });
}

async function updateRequestsAssignment(id, result) {
    let sql = "call updateRequestAssigment(?);";
    console.log(id);
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
            connection.query(sql, [id], function (err, rows, results) {
                if (err) {
                    if (result != null) {
                        result(err, null, null);
                        console.log("err updateRequestAssigment connection.query");
                    }
                    else {
                        console.log("err updateRequestAssigment connection.query");
                        throw err;
                    }
                } else {
                    console.log("sucess updateRequestAssigment connection.query");
                    result(err, rows, results);
                }
            });
        }
    });
}

function selectRatingByUser(req, res) {
    createConnectionToDbP(req, res, queryRatingUser, "rating");
}

async function createRating(req, result) {
    // Declaration of variables
    const connection = await connect();
    let idUser = req.idUser;
    let idAssUser = req.idAssUser;
    let rating = req.rating;

    // insert
    let sql = "INSERT INTO ratings (ratingIdUser, ratingIdAssUser, rating) VALUES (?,?,?)";
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
            connection.query(sql, [idUser, idAssUser, rating], function (err, rows, results) {
                if (err) {
                    if (result != null) {
                        result(err, null, null);
                        console.log("err createRating connection.query");
                    }
                    else {
                        console.log("err createRating connection.query");
                        throw err;
                    }
                } else {
                    console.log("sucess createRating connection.query");
                    result(err, rows, results);
                }
            });
        }
    });
}


module.exports =
{
    selectqueryStatus,
    selectCategories,
    selectUsers,
    selectUser,
    insertUser,
    updateUser,
    deleteUser,
    selectAllTasks,
    selectTasksFind,
    selectTasksByStatus,
    selectTasksByUserId,
    selectTasksById,
    selectTasksByCoord,
    createTask,
    updateTask,
    deleteTask,
    assignmentTask,
    selectAllRequests,
    createRequest,
    updateRequest,
    updateRequestsAssignment,
    selectAllRequestsByTask,
    updateStatusTask,
    updateUserPoints,
    updateUserStatus,
    createRating,
    selectRatingByUser
}
