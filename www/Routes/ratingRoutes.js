// Use express
const express = require("express");
const router = express.Router();

// Use request handles
const requestHandlers = require("../../scripts/request-handlers.js");

// Authorization
var verifyToken = require('./verifyToken');

// Calls a function to get all requests
router.get("/users/:id", requestHandlers.selectRatingByUser);

// Calls a function to get all requests by task
//router.get("/tasks/:id", requestHandlers.selectAllRequestsByTask);

router.post("/", verifyToken, (req, res) => {

    let rating = req.body;

    requestHandlers.createRating(rating, (err, rows, results) => {
        if (err) {
            console.log(err);

            res.status(500).json({ "message": "error" });
        } else {
            res.status(200).json({ "message": "success", "rating": rows, "results": results });
        }

    });
});

module.exports = router;