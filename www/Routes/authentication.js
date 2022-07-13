const express = require('express');
const router = express.Router();
const db = require('../../scripts/dbConnection');
const requestHandlers = require("../../scripts/request-handlers.js");
const { registerValidation, loginValidation } = require('../Utils/validation');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//, 
router.post('/register', registerValidation, (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {   //Mostra os erros ao utilizador

        var error_msg = ''
        errors.array().forEach(function (error) {
            error_msg += "Field " + error.param + ", " + error.msg
        })
        //req.flash('error', error_msg);
        return res.status(400).send({
            msg: error_msg
        });

    } else {

        db.query(
            `SELECT * FROM users WHERE LOWER(userEmail) = LOWER(${db.escape(
                req.body.email
            )});`,
            (err, result) => {
                if (result.length) {
                    return res.status(409).send({
                        msg: 'This user is already in use!'
                    });
                } else {
                    // username is available
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        if (err) {
                            return res.status(500).send({
                                msg: err
                            });
                        } else {
                            let user =
                            {
                                fullName: req.body.fullName,
                                password: hash,
                                email: req.body.email,
                                gender: req.body.gender
                            };
                            requestHandlers.insertUser(user, (err, result) => {
                                if (err) {
                                    //throw err;
                                    return res.status(400).send({
                                        msg: err
                                    });
                                }
                                return res.status(201).send({
                                    msg: 'The user has been registered with us!'
                                });

                            })
                        }
                    });
                }
            }
        );
    }
});
router.post('/login', loginValidation, (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {   //Mostra os erros ao utilizador

        var error_msg = ''
        errors.array().forEach(function (error) {
            error_msg += "Field " + error.param + ", " + error.msg
        })
        //req.flash('error', error_msg);
        return res.status(400).send({
            msg: error_msg
        });

    } else {
        db.query(
            `SELECT * FROM users WHERE userEmail = ${db.escape(req.body.email)};`,
            (err, result) => {
                // user does not exists
                //console.log(result);
                if (err) {
                    //throw err;
                    return res.status(400).send({
                        msg: err
                    });
                }

                if (!result.length) {
                    return res.status(401).send({
                        msg: 'Email or password is incorrect!'
                    });
                }

                // check password
                bcrypt.compare(
                    req.body.password,
                    result[0]['userPassword'],
                    (bErr, bResult) => {
                        // wrong password
                        if (bErr) {
                            //throw bErr;
                            return res.status(401).send({
                                msg: 'Email or password is incorrect!'
                            });
                        }
                        if (bResult) {
                            const token = jwt.sign({ id: result[0].userId }, 'the-super-strong-secrect', { expiresIn: '1h' });
                            /* db.query(
                                `UPDATE users SET last_login = now() WHERE id = '${result[0].id}'`
                            ); */
                            return res.status(200).send({
                                msg: 'Logged in!',
                                token,
                                user: result[0]
                            });
                        }
                        return res.status(401).send({
                            msg: 'Username or password is incorrect!'
                        });
                    }
                );
            }
        );
    }
});

module.exports = router;