

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

const bcrypt = require('bcryptjs');

// Calls a function to get all users
router.get("/users", requestHandlers.selectUsers);

router.get("/users/:id", requestHandlers.selectUser);

// Calls a function update or insert user
router.put("/users/:id", upload.any(), (req, res) => {
    let r = req.body.formUser;
    let userData = JSON.parse(req.body.formUser);
    let password = userData.password;

    if (password.trim().length != 0) {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return res.status(500).send({
                    msg: err
                });
            } else {
                let user =
                {
                    fullName: userData.fullName,
                    password: hash,
                    address: userData.address,
                    zipCode: userData.zipCode,
                    email: userData.email,
                    gender: userData.gender,
                    phone: userData.phone,
                    birthDate: userData.birthDate,
                    id: userData.id
                };
                requestHandlers.createUpdateUser(user, user.id !== null ? true : false, (err, rows, results) => {
                    if (err) {
                        console.log(err);
        
                        res.status(500).json({ "message": "error" });
                    } else {
                        res.status(200).json({ "message": "success", "user": rows, "results": results });
                    }

                })
            }
        });
    } else {
        let user = {
            fullName: userData.fullName,
            address: userData.address,
            zipCode: userData.zipCode,
            email: userData.email,
            gender: userData.gender,
            phone: userData.phone,
            birthDate: userData.birthDate,
            id: userData.id
        };
        requestHandlers.createUpdateUser(user, user.id !== null ? true : false, (err, rows, results) => {
            if (err) {
                console.log(err);

                res.status(500).json({ "message": "error" });
            } else {
                res.status(200).json({ "message": "success", "user": rows, "results": results });
            }

        })
    }

});

// Calls delete user
router.delete("/users/:id", (req, res) => {
    requestHandlers.deleteUser(req.params.id, (err, rows, results) => {
        if (err) {
            console.log(err);

            res.status(500).json({ "message": "error" });
        } else {
            res.status(200).json({ "message": "success", "user": rows, "results": results });
        }

    });
});

module.exports = router;