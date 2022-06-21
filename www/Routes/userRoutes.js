// Use express
const express = require("express");

const router = express.Router();
// Use request handles
const requestHandlers = require("../../scripts/request-handlers.js");
const db = require('../../scripts/dbConnection');

// Use multer
const multer = require('multer');

const upload = multer();

const bcrypt = require('bcryptjs');

const { userValidation } = require('../Utils/validation');
const { validationResult } = require('express-validator');

// Calls a function to get all users
router.get("/", requestHandlers.selectUsers);

router.get("/:id", requestHandlers.selectUser);

// Calls a function update or insert user
router.put("/:id", userValidation, upload.any(), (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {   //Mostra os erros ao utilizador

        var error_msg = ''
        errors.array().forEach(function (error) {
            error_msg += "Campo " + error.param + ", " + error.msg + '<br>'
        })
        req.flash('error', error_msg);
        console.log("error");

        /* res.render('docente/add', { 
            title: 'Adicionar um Novo Docente',
            nome: req.body.nome,
            area: req.body.area,
            experiencia: req.body.experiencia,
            email: req.body.email
        });
         */
    } else {
        let user = req.body;
        let password = user.password;

        db.query(
            `SELECT * FROM users WHERE LOWER(userEmail) = LOWER(${db.escape(
                req.body.email
            )});`,
            (err, result) => {
                if (result.length) {

                    req.flash('error', 'This user is already in use!');

                    return res.status(409).send({
                        msg: 'This user is already in use!'
                    });
                } else {

                    bcrypt.hash(password, 10, (err, hash) => {
                        if (err) {
                            return res.status(500).send({
                                msg: err
                            });
                        } else {
                            if (password.trim().length != 0) {
                                user.password = hash;
                            }
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
                }
            });
    }
});

// Calls delete user
router.delete("/:id", (req, res) => {
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