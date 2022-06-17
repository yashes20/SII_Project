
// Use express
const express = require("express");
const router = express.Router();
// Use request handles
const requestHandlers = require("../../scripts/request-handlers.js");
// Use multer
const multer = require('multer');

const upload = multer();

// Calls a function to get all tasks
router.get("/", requestHandlers.selectAllTasks);

// Calls a function to get all tasks by status
router.get("/status/:id", requestHandlers.selectTasksByStatus);

// Calls a function to get all tasks by user id creation
router.get("/users/:id", requestHandlers.selectTasksByUserId);

//create a new task
// Calls a function create a new task
router.post("/", upload.any(), (req, res) => {
  let task = req.body;
  
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
router.put("/:id", upload.any(), (req, res) => {
    let task = req.body;
    let id = req.params.id; 
    task.id = id;
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
