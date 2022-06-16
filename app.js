/* 
 * Copyright (C) 1883 Thomas Edison - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the XYZ license, which unfortunately won't be
 * written for another century.
 *
 * You should have received a copy of the XYZ license with
 * this file. If not, please write to: , or visit :
 * 
 * Authors: Nicole Fernandes, Nicole Vieira (201700124) and Yasmin Hage (202100778)
 * 
 * Emails: 201700124@estudantes.ips.pt and 202100778@estudantes.ips.pt 
 */

"use strict";

// Use express
const express = require("express");
// Use request handles
const requestHandlers = require("./scripts/request-handlers.js");
// Use body parser
const bodyParser = require("body-parser");

const app = express();
// Use multer
const multer = require('multer');
// Use path
const path = require('path');
// Use fs
const fs = require('fs');

// authentication
// authentication's section
const createError = require('http-errors');
const cors = require('cors');
const indexRouter = require('./router.js');

app.use(express.json());

app.use( bodyParser.json({limit: '50mb'}) );
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: false,
  }));
const upload = multer();
app.use(express.static("www"));


app.use(cors());
 
app.use('/api', indexRouter);
 
// Handling Errors
app.use((err, req, res, next) => {
    // console.log(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
      message: err.message,
    });
});
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("www"));

// Users's section

// Calls a function to get all users
app.get("/status", requestHandlers.selectqueryStatus);
// Calls a function to get all users
app.get("/categories", requestHandlers.selectCategories);

// Calls a function to get all users
app.get("/users", requestHandlers.selectUsers);

app.get("/users/:id", requestHandlers.selectUser);

// Calls a function update or insert user
app.put("/users/:id", upload.any(), (req, res) => {
  let r = req.body.formUser;
  let userData = JSON.parse(req.body.formUser);
  let pass = userData.password.trim().length;
  let user = userData.password.trim().length != 0 ?
          {  fullName: userData.fullName ,
              username:userData.username,
              password:userData.password,
              address:userData.address,
              zipCode:userData.zipCode,
              email:userData.email,
              gender:userData.gender,
              phone:userData.phone,
              birthDate:userData.birthDate,
              id: userData.id
          } :{
              fullName: userData.fullName,
              username:userData.username,
              address:userData.address,
              zipCode:userData.zipCode,
              email:userData.email,
              gender:userData.gender,
              phone:userData.phone,
              birthDate:userData.birthDate,
              id: userData.id
          };
  requestHandlers.createUpdateUser(user, user.id !== null ? true : false, (err, rows, results) => {
      if (err) {
          console.log(err);

          res.status(500).json({"message": "error"});
      } else {
          res.status(200).json({"message": "success", "user": rows, "results":results });
      }

  })
});

// Calls delete user
app.delete("/users/:id",  (req, res) => {
    requestHandlers.deleteUser(req.params.id, (err, rows, results) => {
        if (err) {
            console.log(err);
  
            res.status(500).json({"message": "error"});
        } else {
            res.status(200).json({"message": "success", "user": rows, "results":results });
        }
  
    });
});

// Calls a function to get all tasks
app.get("/tasks", requestHandlers.selectAllTasks);

// Calls a function to get all tasks by status
app.get("/tasks/status/:id", requestHandlers.selectTasksByStatus);

// Calls a function to get all tasks by user id creation
app.get("/tasks/users/:id", requestHandlers.selectTasksByUserId);

//create a new task
// Calls a function create a new task
app.post("/tasks", upload.any(), (req, res) => {
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
app.put("/tasks", upload.any(), (req, res) => {
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

app.listen(8082, function () {
  console.log("Server running at http://localhost:8082");
});