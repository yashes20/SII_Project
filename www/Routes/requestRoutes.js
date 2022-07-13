// Use express
const express = require("express");
const router = express.Router();

// Use request handles
const requestHandlers = require("../../scripts/request-handlers.js");

// Authorization
var verifyToken = require('./verifyToken');

// Calls a function to get all requests
router.get("/", requestHandlers.selectAllRequests);

// Calls a function to get all requests by task
router.get("/tasks/:id", requestHandlers.selectAllRequestsByTask);

router.post("/", verifyToken, (req, res) => {

    let request = req.body;

    requestHandlers.createRequest(request, (err, rows, results) => {
        if (err) {
            console.log(err);

            res.status(500).json({ "message": "error" });
        } else {
            res.status(200).json({ "message": "success", "request": rows, "results": results });
        }

    });
});

// Calls a function update a request 
router.put("/:id", verifyToken, (req, res) => {
    
    let id = req.params.id;

    requestHandlers.updateRequestsAssignment(id, (err, rows, results) => {
        if (err) {
            console.log(err);

            res.status(500).json({ "message": "error" });
        } else {
            res.status(200).json({ "message": "success", "request": rows, "results": results });
        }

    })
});

module.exports = router;
