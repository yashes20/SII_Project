
// Use express
const express = require("express");
const router = express.Router();

// Use request handles
const requestHandlers = require("../../scripts/request-handlers.js");

// Authorization

var verifyToken = require('./verifyToken');

const { newTaskValidation, updateTaskValidation } = require('../Utils/validation');
const { validationResult } = require('express-validator');

// Calls a function to get all tasks
router.get("/:id", requestHandlers.selectTasksById);

// Calls a function to get task by id
router.get("/", requestHandlers.selectAllTasks);

// Calls a function to get all tasks by status
router.get("/status/:id", requestHandlers.selectTasksByStatus);

// Calls a function to get all tasks by user id creation
router.get("/users/:id", requestHandlers.selectTasksByUserId);

//create a new task
// Calls a function create a new task
router.post("/", newTaskValidation, (req, res) => {

    let task = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {   //Mostra os erros ao utilizador

        var error_msg = ''
        errors.array().forEach(function (error) {
            error_msg += "Campo " + error.param + ", " + error.msg + '<br>'
        })
        req.flash('error', error_msg);
        console.log("error");
    } else {

        requestHandlers.createTask(task, (err, rows, results) => {
            if (err) {
                console.log(err);

                res.status(500).json({ "message": "error" });
            } else {
                res.status(200).json({ "message": "success", "task": rows, "results": results });
            }

        })
    }
});

// Calls a function update a task
router.put("/:id", updateTaskValidation, (req, res) => {
    let task = req.body;
    let id = req.params.id;
    task.id = id;
    //task.dateAssignment = dateA;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {   //Mostra os erros ao utilizador

        var error_msg = ''
        errors.array().forEach(function (error) {
            error_msg += "Campo " + error.param + ", " + error.msg + '<br>'
        })
        req.flash('error', error_msg);
        console.log("error");

    } else {
        requestHandlers.updateTask(task, (err, rows, results) => {
            if (err) {
                console.log(err);

                res.status(500).json({ "message": "error" });
            } else {
                res.status(200).json({ "message": "success", "task": rows, "results": results });
            }

        })
    }
});
module.exports = router;
