//tasks.test.js
const request = require('supertest');
const taskRouter = require('../www/Routes/taskRoutes.js');
const taskAuthentication = require('../www/Routes/authentication.js');
const express = require("express");
const app = express(); //an instance of an express app, a 'fake' express app
const bodyParser = require("body-parser");
var token = '';

//const taskRouter = require('./www/Routes/taskRoutes.js');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/tasks', taskRouter);
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
                    expect(response.body.message).toEqual("success");
                    expect(response.body.token).not.toBeNull();

                    
            });
    } catch (err) {
        // write test for failure here
        console.log(`Error ${err}`)
    }
  })
});

it('get tasks', async () => {

    await request(app).get('/tasks')
        .set('Accept', /json/)
        .set('Authorization', 'Bearer ' + token) // Works.
        .expect(200).expect('Content-type', /json/)
        .then((response) => {
            // Check data
            expect(response.body.message).toEqual("success");
            expect(response.body.task[0].taskId).not.toBeNull();
        });
});

it('get tasks status', async () => {

    await request(app).get('/tasks/status/' + "1")
        .set('Accept', /json/)
        .set('Authorization', 'Bearer ' + token) // Works.
        .expect(200).expect('Content-type', /json/)
        .then((response) => {
            // Check data
            expect(response.body.message).toEqual("success");
            //expect(response.body.task[0]).toEqual("1");
        });
});
 
it('get tasks by user', async () => {

    await request(app).get('/tasks/users/' + "1")
    .set('Accept', /json/)
    .set('Authorization', 'Bearer ' + token) // Works.
    .expect(200).expect('Content-type', /json/)
        .then((response) => {
            // Check data
            expect(response.body.message).toEqual("success");
            expect(response.body.task[0].userCreation).toEqual(1);
        });
});

it('get tasks by id', async () => {

    await request(app).get('/tasks/' + "1")
        //.expect(200)
        //.set('Accept', /json/)
        .set('Accept', /json/)
        .set('Authorization', 'Bearer ' + token) // Works.
        .expect(200).expect('Content-type', /json/)
        .then((response) => {
            // Check data
            //console.log(response);
            expect(response.body.message).toEqual("success");
            expect(response.body.task[0].taskId).toEqual(1);
        });
});


it('get tasks by coordenates', async () => {

    await request(app).get('/tasks/' + -30.027700 + '/' + -51.163270)
        //.expect(200)
        //.set('Accept', /json/)
        .set('Accept', /json/)
        .set('Authorization', 'Bearer ' + token) // Works.
        //.expect(200).expect('Content-type', /json/)
        .then((response) => {
            // Check data
            //console.log(response.body);
            expect(response.body.message).toEqual("success");
            expect(response.body.task[0].taskId).not.toBeNull();
        });
});

describe("POST request", () => {

    try {
        let postTask;
        beforeEach(function () {
            console.log("Input create a task");
            postTask = {
                name: "Task test",
                description: "description",
                category: 1,
                userCreation: 1,
                dateAssignment: "2022-06-22 15:40",
                address: "address task",
                latitude: "-30.027668",
                longitude: "-51.163269"
            }; // task to insert

        });
        afterEach(function () {
            console.log("task are inserted");
        });

        it('should create a new task', async () => {
            try {
                await request(app).post('/tasks')
                
                    .send(postTask)
                    .set('Accept', /json/)
                    .set('Authorization', 'Bearer ' + token) // Works.
                    .expect(200).expect('Content-type', /json/)
                    
                    .then((response) => {
                        //console.log(response);
                        // Check data
                        expect(response.body.message).toEqual("success");
                        expect(response.body.task.insertId).not.toBeNull();

                        
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

describe("PUT request ", () => {

    try {
        let putTask;
        beforeEach(function () {
            console.log("Input PUT a task");
            putTask = {
                name: "Task test",
                description: "description",
                status: 1,
                category: 1,
                userCreation: 1,
                userAssignment: 2,
                dateAssignment: "2022-06-25 15:40",
                address: "address task",
                latitude: "-30.027668",
                longitude: "-51.163269"
            }; // task to update

        });
        afterEach(function () {
            console.log("task are updated");
        });

        it('should put task', async () => {
            try {
                await request(app).put('/tasks/' + 2)
                    .send(putTask)
                    .set('Accept', /json/)
                    .set('Authorization', 'Bearer ' + token) // Works.
                    .expect(200).expect('Content-type', /json/)
                    .then((response) => {
                        //console.log(response);
                        // Check data
                        expect(response.body.message).toEqual("success");
                        expect(response.body.task.affectedRows).toEqual(1);

                        
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

describe("PUT request assignment", () => {

    try {
        let putTask;
        beforeEach(function () {
            console.log("Input PUT a task assignment");
            putTask = {
                userAssignment: 2
            }; // task to update

        });
        afterEach(function () {
            console.log("task are updated");
        });

        it('should put task', async () => {
            try {
                await request(app).put('/tasks/assignment/' + 1)
                    .send(putTask)
                    .set('Accept', /json/)
                    .set('Authorization', 'Bearer ' + token) // Works.
                    .expect(200).expect('Content-type', /json/)
                    
                    .then((response) => {
                        //console.log(response);
                        // Check data
                        expect(response.body.message).toEqual("success");
                        expect(response.body.task.affectedRows).toEqual(1);

                        
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
        
        it('should put task to invalid', async () => {
            try {
                await request(app).delete('/tasks/' + 2)
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