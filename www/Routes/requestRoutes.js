// Use express
const express = require("express");
const router = express.Router();

// Use request handles
const requestHandlers = require("../../scripts/request-handlers.js");

// Authorization
var verifyToken = require('./verifyToken');

// Calls a function to get all tasks
router.get("/", requestHandlers.selectAllRequests);

router.post("/", (req, res) => {

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

module.exports = router;
