//tasks.test.js
const request = require('supertest');
const requestRouter = require('../www/Routes/requestRoutes.js');
const express = require("express");
const app = express(); //an instance of an express app, a 'fake' express app
const bodyParser = require("body-parser");
var path = require('path');
var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU3NTc2Njk1LCJleHAiOjE2NTc1ODAyOTV9.7wexCU_Cllj9BCKQ5KTY_tyTEKlwE2sotuTjY5KEOaY';

//const taskRouter = require('./www/Routes/taskRoutes.js');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/requests', requestRouter);


describe("POST request", () => {

    try {
        let postRequest;
        beforeEach(function () {
            console.log("Input create a request");
            postRequest = {
                idVoluntary: 2,
                idTask: 1
            }; // request to insert

        });
        afterEach(function () {
            console.log("request are inserted");
        });

        it('should create a new request', async () => {
            try {
                await request(app).post('/requests')
                    .send(postRequest)
                    .set('Accept', /json/)
                    .set('Authorization', 'Bearer ' + token) // Works.
                    //.set('Authorization', 'Bearer ' + token) // Works.
                    .expect(200).expect('Content-type', /json/)
                    
                    .then((response) => {
                        //console.log(response);
                        // Check data
                        expect(response.body.message).toEqual("success");
                        expect(response.body.request.insertId).not.toBeNull();

                        
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
 
it('get all requests', async () => {

     await request(app).get('/requests')
         .set('Accept', /json/)
         .set('Authorization', 'Bearer ' + token) // Works.
         .expect(200)
         .then((response) => {
             // Check data
             expect(response.body.message).toEqual("success");
             expect(response.body.request[0].requestId).not.toBeNull();
         });
 });

 it('get requests by task id', async () => {

     await request(app).get('/requests/tasks/' + "1")
         .set('Accept', /json/)
         .set('Authorization', 'Bearer ' + token) // Works.
         .expect(200)
         .then((response) => {
             //console.log(response.body);
             // Check data
             expect(response.body.message).toEqual("success");
             //expect(response.body.request[0].taskId).toEqual("1");
         });
 });

 describe("PUT request", () => {

    try {
        let putRequest;
        beforeEach(function () {
            console.log("Input PUT a request");
            putRequest = {
                idVoluntary: 2,
                idTask: 1
            }; // task to update

        });
        afterEach(function () {
            console.log("request are updated");
        });

        it('should put a request', async () => {
            try {
                await request(app).put('/requests/' + 3)
                    .send(putRequest)
                    .set('Accept', /json/)
                    .set('Authorization', 'Bearer ' + token) // Works.
                    .expect(200).expect('Content-type', /json/)
                    
                    .then((response) => {
                        //console.log(response);
                        // Check data
                        expect(response.body.message).toEqual("success");
                        expect(response.body.request.affectedRows).toEqual(1);

                        
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

