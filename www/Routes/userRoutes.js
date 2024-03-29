// Use express
const express = require("express");

const router = express.Router();
// Use request handles
const requestHandlers = require("../../scripts/request-handlers.js");

// Use multer
const multer = require('multer');

const upload = multer();

// Authorization
var verifyToken = require('./verifyToken');

const bcrypt = require('bcryptjs');

const { userValidation } = require('../Utils/validation');
const { validationResult } = require('express-validator');

// Calls a function to get all users
router.get("/", verifyToken, requestHandlers.selectUsers);

router.get("/:id", verifyToken, requestHandlers.selectUser);

// Calls a function update or insert user
router.put("/:id", verifyToken, userValidation, (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {   //Mostra os erros ao utilizador
        var error_msg = ''
        errors.array().forEach(function (error) {
            error_msg += "Field " + error.param + ", " + error.msg
        })
        return res.status(400).send({
            msg: error_msg
        });
    } else {
        let user = req.body;
        let password = user.password;
        user.id = req.params.id;

        if (password != undefined && password != '') {
            let t;
            user.password = bcrypt.hashSync(password, 10);

        }
        if (user != undefined) {
            requestHandlers.updateUser(user, (err, rows, results) => {
                if (err) {
                    console.log(err);

                    res.status(500).json({ "message": "error" });
                } else {
                    res.status(200).json({ "message": "success", "user": rows, "results": results });
                }

            });
        }

    }
});

// Calls delete user
router.delete("/:id", verifyToken, (req, res) => {
    requestHandlers.deleteUser(req.params.id, (err, rows, results) => {
        if (err) {
            res.status(500).json({ "message": "error" });
        } else {
            res.status(200).json({ "message": "success", "user": rows, "results": results });
        }
    });
});

module.exports = router;