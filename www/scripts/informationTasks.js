/* 
 * Copyright (C) 1883 Thomas Edison - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the XYZ license, which unfortunately won't be
 * written for another century.
 *
 * You should have received a copy of the XYZ license with
 * this file. If not, please write to: , or visit :
 * 
 * Authors: Pedro Freitas, Nicole Vieira (201700124) Nicole Fernandes and Yasmin Hage (202100778)
 * 
 * Emails: 201700124@estudantes.ips.pt and 202100778@estudantes.ips.pt 
 */
"use strict";

//const { sendFile } = require("express/lib/response");

/** 
* @class Saves all the information about the user
* @constructs InformationTasks
* @param {string} id - id of the HTML element that contains the information.
* 
* @property {string} id - id of the HTML element that contains the information.
* @property {task[]} tasks - Array of objects of type tasks, to store all the tasks of our system
  @property {[category]}  categories
  @property {[user]}  users
*/
class InformationTasks {
    constructor(id) {
        this.id = id;
        this.tasks = [];
        this.categories = [];
        this.users = [];
    }
    
    /**
     * Show the users table
     * 
     * @param {*} acao - if is delete, insert or update
     * @returns 
     */
    showTasks(acao) {
        let self = this;
        if (acao === "select") {
           infoTasks.getTasks();
        }
        /** Update the title */
        // document.getElementById("headerTitle").textContent="Users";
        // if (sessionStorageObter("username_login")  === null) {
        //     document.getElementById("divInformation").style.display="none";
        //     return;
        // }
        // else {
        document.getElementById("divInformation").style.display="block";
        //}
        // document.getElementById("demo").style.display = "none";
        

        let cleanDiv= document.createElement("div");
        replaceChilds("divInformation",cleanDiv);

        let taskTable = document.createElement("table");
        taskTable.setAttribute("id", "taskTable");
        let th = tableLine(new Task(),true);
        taskTable.appendChild(th);
        this.tasks.forEach(p=>{
            let tr = tableLine(p);
            taskTable.appendChild(tr);
        });
        replaceChilds("divInformation",taskTable);

        var table = document.getElementById("taskTable");
        var rows = table.getElementsByTagName("tr");

        for(var i = 0; i < rows.length; i++){
            var row = rows[i];

            row.addEventListener("click", function(){
            //Add to the current
            selLinha(this, false); //Select only one
            //selLinha(this, true); //Select multiple
            });
        }
        
        // Show content
        
        /**
         * Function to handle the delete event
         */
        function deleteTaskEventHandler() {
            document.getElementById('formTask').style.display = "none";
            document.getElementById('deleteTask').style.display = "block";
            document.getElementById('deleteTask').action = 'javascript:infoTasks.processingTask("delete");';
            document.getElementById("userModalTitle").innerHTML = "Delete Task";
            loadUser("delete");
        }

        /**
         * Function to handle the insert event
         */
        function newTaskEventHandler() {
            document.getElementById('formTask').style.display = "block";
            document.getElementById('deleteTask').style.display = "none";
            document.getElementById('formTask').action = 'javascript:infoTasks.processingTask("create");';
            document.getElementById("clientModalTitle").innerHTML = "New Task";
            const button = document.getElementById('insertNew');
            button.setAttribute('data-bs-toggle', 'modal');
            button.setAttribute('data-bs-target', '#myModal');
            setupForm();
        }

        /**
         * Function to handle the update event
         */
        function updateTaskEventHandler() {
            document.getElementById('formTask').style.display = "block";
            document.getElementById('deleteTask').style.display = "none";
            document.getElementById('formTask').action = 'javascript:infoTasks.processingTask("update");';
            document.getElementById("userModalTitle").innerHTML = "Update Task";
            const button = document.getElementById('updateData');
            button.setAttribute('data-bs-toggle', 'modal');
            button.setAttribute('data-bs-target', '#myModal');
            //cleanCanvasUser();
            loadUser("update");
        }

        /**
         * Function to set up the tasks's form
         */
        function setupForm(){
            document.getElementById('formTask').style.display = 'block';
            document.getElementById('formTask').reset();
            //document.getElementById('formClient').innerHTML = '';
        }

        /**
         * Function to load a tasks's information into a form
         * 
         * @param {*} type 
         */
        function loadUser(type){
            document.getElementById('formTask').reset();
            

            if(type === "delete"){
                if (selected(document.getElementById("taskTable"), "tasks", "delete"))
                document.getElementById('formTask').style.display = 'none';
            }
            else if(type === "update"){
                if (selected(document.getElementById("userTable"), "tasks", "update"))
                document.getElementById('formTask').style.display = 'block';
            }
        }
        
        var divButtons = document.createElement('div');
        divButtons.id = 'divButtons';
        document.getElementById("divInformation").appendChild(divButtons);

        createButton("divButtons", updateTaskEventHandler, 'Update Task');
        //let type = localStorageObter("type");
        //if (type === "Admin") {
            createButton("divButtons", newTaskEventHandler, 'New Task');
            createButton("divButtons", deleteTaskEventHandler, 'Delete Task');
            //createButton("divInformation", selectAllClientEventHandler, 'Select All');
        //}
    }

    /**
     * Function that has as main goal to request to the NODE.JS server the user resource through the GET verb, using asynchronous requests and JSON
     */
     getTasks() {
        const self = this;
        let tasks = this.tasks;
        tasks.length = 0;
        var tableElement = document.getElementById("taskTable");
        tableElement = document.createElement("table");
        tableElement.setAttribute("id", "taskTable");
        var xhr = new XMLHttpRequest();
        xhr.responseType="json";
        xhr.open("GET", "/tasks", true);
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let info = xhr.response.task;
                info.forEach(p => {
                    tasks.push(p);
                });
                localStorageGravar("tasks",JSON.stringify(tasks));
                self.showTasks("selectAll");
            }
        };
        xhr.send(tableElement);
           
    }

    /**
     * Function that has as main goal to request to the NODE.JS server the resource task by id through the GET verb, using asynchronous requests and JSON
     */
     getTaskByUserId(id) {
        const self = this;
        var tableElement = document.getElementById("taskTable");
        tableElement = document.createElement("table");
        tableElement.setAttribute("id", "taskTable");

        let tasks = this.tasks;
        tasks.length = 0;
        var xhr = new XMLHttpRequest();
        xhr.responseType="json";
        xhr.open('GET', '/taskByUserId/' + id, true);
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let info = xhr.response.task;
                info.forEach(p => {
                    tasks.push(p);
                });
                localStorageGravar("tasks",JSON.stringify(tasks));
                self.showTasks("selectById");
            }
        };
        xhr.send(tableElement);
    } 

    /**
     * Function that inserts or updates the resource user with a request to the NODE.JS server through the POST or PUT verb, using asynchronous requests and JSON
     * @param {String} acao - controls which CRUD operation we want to do
     */
    processingTask (acao) {

        const id = parseInt(document.getElementById('id').value);
        const taskName = document.getElementById('taskName').value;
        const description = document.getElementById('description').value;
        const category = document.getElementById('category').value;
        const userCreation = document.getElementById('userCreation').value;
        const address = document.getElementById('address').value;

        let args = [];
        args.push(taskName);
        args.push(description);
        args.push(category);
        args.push(userCreation);
        args.push(address);

        const formTask = new FormTask(id, taskName,description, category, address);
        if (acao === 'create') {
            args.push(password);
            if (validadeForm(args)){
                this.putTask(formTask, false);
            } 
        } else if (acao === 'update') {
            if (validadeForm(args)){
                this.putTask(formTask, true);
            }
            
        } else if (acao === 'delete') {
            this.deleteTask(formTask);
        }
    }

    /**
     * Function to update or insert a task
     * 
     * @param {*} formTask - tasks's form with all the information
     * @param {*} isUpdate - if the action is update or insert
     */
    /* putClient(formClient, isUpdate){
        const self = this;
        let formData = new FormData();
        formData.append('formClient', JSON.stringify(formClient));

        const xhr = new XMLHttpRequest();
        xhr.responseType="json";
        xhr.open('PUT', '/clients/' + formClient.id);
        
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                //hself.clients[self.clients.findIndex(i => i.id === client.id)] = client;
                if(!isUpdate){
                    let id = xhr.response.formClient.insertId;
                    self.getClientById(id);
                    self.showClients("insert");
                }
                else{
                    self.getClientById(formClient.id);
                    self.showClients("update");
                }
            }
        }
        //xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(formData);
    } */
    
    /**
     * Function to delete an existing client
     * 
     * @param {*} formTask - client's form with all the information
     */
    /* deleteClient(formClient){
        const self = this;
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', '/clients/' + formClient.id);
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                self.clients.splice(self.clients.findIndex(i => i.clientId === formClient.id), 1);
                self.showClients("delete");
            }
        };
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(formClient));
    } */
}