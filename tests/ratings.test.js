const request = require('supertest');
const ratingRouter = require('../www/Routes/ratingRoutes.js');
const taskAuthentication = require('../www/Routes/authentication.js');
const express = require("express");
const app = express(); //an instance of an express app, a 'fake' express app
const bodyParser = require("body-parser");
var token = '';

//const taskRouter = require('./www/Routes/taskRoutes.js');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/ratings', ratingRouter);
app.use('/api', taskAuthentication);


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
                    //expect(response.body.message).toEqual("success");
                    expect(response.body.token).not.toBeNull();

                    
            });
    } catch (err) {
        // write test for failure here
        console.log(`Error ${err}`)
    }
  })
});

describe("POST rating", () => {

    try {
        let postRating;
        beforeEach(function () {
            console.log("Input create a rating");
            postRating = {
                idUser: 2,
                idAssUser: 1,
                rating: 2
            }; // rating to insert

        });
        afterEach(function () {
            console.log("rating are inserted");
        });

        it('should create a new rating', async () => {
            try {
                await request(app).post('/ratings')
                    .send(postRating)
                    .set('Accept', /json/)
                    .set('Authorization', 'Bearer ' + token) // Works.
                    //.set('Authorization', 'Bearer ' + token) // Works.
                    .expect(200).expect('Content-type', /json/)
                    
                    .then((response) => {
                        console.log(response.body);
                        // Check data
                        expect(response.body.message).toEqual('success');
                        expect(response.body.rating.insertId).not.toBeNull();

                        
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
 
it('get rating by user id', async () => {

    await request(app).get('/ratings/users/' + "1")
        //.expect(200)
        //.set('Accept', /json/)
        .set('Accept', /json/)
        .set('Authorization', 'Bearer ' + token) // Works.
        .expect(200).expect('Content-type', /json/)
        .then((response) => {
            // Check data
            console.log(response.body.rating[0].rating);
            expect(response.body.message).toEqual("success");
            expect(response.body.rating[0].rating).not.toBeNull();
        });
});