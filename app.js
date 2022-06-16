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

app.use(express.json());

app.use( bodyParser.json({limit: '50mb'}) );
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: false,
  }));

app.use(express.static("www"));

// authentication
// authentication's section
const createError = require('http-errors');
const cors = require('cors');
app.use(cors());
const loginRouter = require('./www/Routes/login.js');
const userRouter = require('./www/Routes/userRoutes.js');
const taskRouter = require('./www/Routes/taskRoutes.js');

app.use('/api', loginRouter);

app.use('/', userRouter);

app.use('/', taskRouter);
 
// Handling Errors
app.use((err, req, res, next) => {
    // console.log(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
      message: err.message,
    });
});

// Calls a function to get all users
app.get("/status", requestHandlers.selectqueryStatus);
// Calls a function to get all users
app.get("/categories", requestHandlers.selectCategories);

app.listen(8082, function () {
  console.log("Server running at http://localhost:8082");
});