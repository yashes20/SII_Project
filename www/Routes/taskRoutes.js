
// Use express
const express = require("express");
const router = express.Router();
// Use request handles
const requestHandlers = require("../../scripts/request-handlers.js");
// Use body parser
const bodyParser = require("body-parser");
// Use multer
const multer = require('multer');
// Use path
const path = require('path');
// Use fs
const fs = require('fs');

const upload = multer();

// Calls a function to get all tasks
router.get("/tasks", requestHandlers.selectAllTasks);

// Calls a function to get all tasks by status
router.get("/tasks/status/:id", requestHandlers.selectTasksByStatus);

// Calls a function to get all tasks by user id creation
router.get("/tasks/users/:id", requestHandlers.selectTasksByUserId);

//create a new task
// Calls a function create a new task
router.post("/tasks", upload.any(), (req, res) => {
  let r = req.body.formTask;
  let taskData = JSON.parse(req.body.formTask);
  let task = 
          { name : taskData.name,
            description : taskData.description,
            category : taskData.category,
            userCreation : taskData.userCreation,
            address : taskData.address,
            taskLatitude : taskData.latitude,
            taskLongitude : taskData.longitude
          } 
  requestHandlers.createTask(task, (err, rows, results) => {
      if (err) {
          console.log(err);

          res.status(500).json({"message": "error"});
      } else {
          res.status(200).json({"message": "success", "task": rows, "results":results });
      }

  })
});

// Calls a function update a task
router.put("/tasks", upload.any(), (req, res) => {
    let r = req.body.formTask;
    let taskData = JSON.parse(req.body.formTask);
    let task = 
            { id : taskData.id,
              name : taskData.name,
              description : taskData.description,
              category : taskData.category,
              idStatus: taskData.idStatus,
              userCreation : taskData.userCreation,
              userAssignment: taskData.userAssignment,
              address : taskData.address,
              taskLatitude : taskData.latitude,
              taskLongitude : taskData.longitude
            } 
    requestHandlers.updateTask(task, (err, rows, results) => {
        if (err) {
            console.log(err);
  
            res.status(500).json({"message": "error"});
        } else {
            res.status(200).json({"message": "success", "task": rows, "results":results });
        }
  
    })
  });
  module.exports = router;
