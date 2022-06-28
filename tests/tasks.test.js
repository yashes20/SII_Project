//tasks.test.js
const request = require('supertest');
const taskRouter = require('../www/Routes/taskRoutes.js');
const task = require('../www/Models/task.js');
var taskPost = require('../www/Models/postTask.js');
const rows = require('../scripts/request-handlers.js');
const express = require("express");
const app = express(); //an instance of an express app, a 'fake' express app
const bodyParser = require("body-parser");
var path = require('path');

//const taskRouter = require('./www/Routes/taskRoutes.js');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/tasks', taskRouter);


it('get tasks', async () => {

    await request(app).get('/tasks')
        .expect(200)
        .then((response) => {
            // Check type and length
            //console.log(response.body);
            expect(response.body.message).toEqual("success");
            //expect(response.body.length).toEqual(1);

            // Check data
            //expect(response.body.task).toBe(Task);
            //expect(response.body[0].title).toBe(post.title);
            //expect(response.body[0].content).toBe(post.content);
        });
    //console.log(res.task);
    //expect(res.statusCode).toEqual(200)
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
                    .expect(200).expect('Content-type', /json/)
                    
                    .then((response) => {
                        //console.log(response);
                        taskId = response.body.task.insertId;
                        console.log("POST response taskId : ", taskId)
                        if (response.message) {
                            return console.log(response.message);
                        }
                        console.log("POST response body : ", response.body)
                        // Check data
                        .expect(response.body.message).toEqual("success")
                        //done();
                        //expect(response.body.message).toEqual("success");
                        //expect(response.statusCode).toEqual(200)
                        //expect(response.body.length).toEqual(1);

                        // Check data
                        //expect(response.body.task).toBe(Task);
                        //expect(response.body[0].title).toBe(post.title);
                        //expect(response.body[0].content).toBe(post.content);
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

/*test('Create a task', async () => {
    
});*/