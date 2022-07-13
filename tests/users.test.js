//tasks.test.js
const request = require('supertest');
const userRouter = require('../www/Routes/userRoutes.js');
const authRouter = require('../www/Routes/authentication.js');
const express = require("express");
const app = express(); //an instance of an express app, a 'fake' express app
const bodyParser = require("body-parser");
var token = '';

//const taskRouter = require('./www/Routes/taskRoutes.js');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', userRouter);
app.use('/api', authRouter);

describe("POST Login", () => {

    login = {
        name: "user test",
        email: "yashes20@yahoo.com.br",
        password: "12345678"
    }; // login

    it('should login', async () => {
    try {
            await await request(app).post('/api/login')
            
                .send(login)
                .set('Accept', /json/)
                .expect(200).expect('Content-type', /json/)
                
                .then((response) => {
                    console.log(response.body.token);
                    // Check data
                    token = response.body.token;
                    expect(response.body.message).toEqual("success");
                    expect(response.body.token).not.toBeNull();

                    
            });
    } catch (err) {
        // write test for failure here
        console.log(`Error ${err}`)
    }
  })
});

it('get users', async () => {

    await request(app).get('/users')
        .set('Accept', /json/)
        .set('Authorization', 'Bearer ' + token) // Works.
        .expect(200)
        .then((response) => {
            // Check data
            expect(response.body.message).toEqual("success");
            expect(response.body.user[0].userId).not.toBeNull();
        });
});

it('get user by id', async () => {

    await request(app).get('/users/' + "1")
        .set('Accept', /json/)
        .set('Authorization', 'Bearer ' + token) // Works.
        .expect(200)
        .then((response) => {
            // Check data
            expect(response.body.message).toEqual("success");
            expect(response.body.user[0].userId).toEqual(1);
        });
});

describe("POST request", () => {

    try {
        let postUser;
        beforeEach(function () {
            console.log("Input create a user");
            postUser = {
                    "fullName": "teste",
                    "password": "123456",
                    "email": "teste30@gmail.com",
                    "gender": "N"
            };
            // user to insert

        });
        afterEach(function () {
            console.log("user are inserted");
        });

        it('should create a new user', async () => {
            try {
                await request(app).post('/api/register/')
                    .send(postUser)
                    .set('Accept', /json/)
                    .expect(201).expect('Content-type', /json/)
                    
                    .then((response) => {
                        console.log(response.body);
                        // Check data
                        expect(response.body.msg).toEqual("The user has been registered with us!");
                        
                    });
            } catch (err) {
                // write test for failure here
                console.log(`Error ${err}`)
            }

        })

    }
    catch (err) {
        console.log("ERROR : ", err)
    }
});

 describe("PUT request", () => {

    try {
        let putUser;
        beforeEach(function () {
            console.log("Input UPDATE a user");
            putUser = {
                    "fullName": "teste update",
                    "gender": "N",
                    "password": "1234567",
                    "address" : "address",
                    "zipCode" : "898988",
                    "phone" : "90988888",
                    "birthDate": "1987-06-25"
            };
            // user to insert

        });
        afterEach(function () {
            console.log("user are updated");
        });

        it('should update a user', async () => {
            try {
                await request(app).put('/users/' + 3)
                    .send(putUser)
                    .set('Accept', /json/)
                    .set('Authorization', 'Bearer ' + token) // Works.
                    .expect(200).expect('Content-type', /json/)
                    
                    .then((response) => {
                        console.log(response.body);
                        // Check data
                        expect(response.body.message).toEqual("success");
                        expect(response.body.user.affectedRows).toEqual(1);

                        
                    });
            } catch (err) {
                // write test for failure here
                console.log(`Error ${err}`)
            }

        })

    }
    catch (err) {
        console.log("ERROR : ", err)
    }
});

describe("DELETE request", () => {

    try {
        
        it('should put user to invalid', async () => {
            try {
                await request(app).delete('/users/' + 2)
                    .set('Accept', /json/)
                    .set('Authorization', 'Bearer ' + token) // Works.
                    .expect(200).expect('Content-type', /json/)
                    
                    .then((response) => {
                        //console.log(response);
                        // Check data
                        expect(response.body.message).toEqual("success");

                        
                    });
            } catch (err) {
                // write test for failure here
                console.log(`Error ${err}`)
            }

        })

    }
    catch (err) {
        console.log("ERROR : ", err)
    }
}); 