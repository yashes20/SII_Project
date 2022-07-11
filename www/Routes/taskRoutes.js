// Use express
const express = require("express");
const router = express.Router();

// Use request handles
const requestHandlers = require("../../scripts/request-handlers.js");

// Authorization
var verifyToken = require('./verifyToken');

const { newTaskValidation, updateTaskValidation } = require('../Utils/validation');
const { validationResult } = require('express-validator');

// Calls a function to get a task by id
router.get("/:id", verifyToken, requestHandlers.selectTasksById);

// Calls a function to get all tasks
router.get("/",  verifyToken, requestHandlers.selectAllTasks);

router.post("/find",  verifyToken, requestHandlers.selectTasksFind);

// Calls a function to get all tasks by status
router.get("/status/:id",  verifyToken, requestHandlers.selectTasksByStatus);

// Calls a function to get all tasks by user id creation
router.get("/users/:id",  verifyToken, requestHandlers.selectTasksByUserId);

// Calls a function to get all tasks by coordenates
router.get("/tasks/:latitude/:longitude", verifyToken, requestHandlers.selectTasksByCoord);

//create a new task
// Calls a function create a new task
router.post("/", verifyToken, newTaskValidation, (req, res) => {

    let task = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {   //Mostra os erros ao utilizador

        var error_msg = ''
        errors.array().forEach(function (error) {
            error_msg += "Field " + error.param + ", " + error.msg
        })
        //req.flash('error', error_msg);
        return res.status(400).send({
            msg: error_msg
        });

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
router.put("/:id", verifyToken, updateTaskValidation, (req, res) => {
    let task = req.body;
    let id = req.params.id;
    task.id = id;
    //task.dateAssignment = dateA;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {   //Mostra os erros ao utilizador

        var error_msg = ''
        errors.array().forEach(function (error) {
            error_msg += "Field " + error.param + ", " + error.msg
        })
        //req.flash('error', error_msg);
        return res.status(400).send({
            msg: error_msg
        });

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

// Calls a function update a task
router.put("/assignment/:id", verifyToken, (req, res) => {

    let task = req.body;
    let id = req.params.id;
    task.idTask = id;
    
    requestHandlers.assignmentTask(task, (err, rows, results) => {
        if (err) {
            console.log(err);

            res.status(500).json({ "message": "error" });
        } else {
            res.status(200).json({ "message": "success", "task": rows, "results": results });
        }

    })
    
});

// Calls delete task
router.delete("/:id", verifyToken, (req, res) => {
    requestHandlers.deleteTask(req.params.id, (err, rows, results) => {
        if (err) {
            console.log(err);

            res.status(500).json({ "message": "error" });
        } else {
            res.status(200).json({ "message": "success", "task": rows, "results": results });
        }

    });
});

module.exports = router;
