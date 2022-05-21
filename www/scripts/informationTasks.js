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
* @class Saves all the information about the tasks
* @constructs InformationTasks
* @param {string} id - id of the HTML element that contains the information.
* 
* @property {string} id - id of the HTML element that contains the information.
* @property {task[]} tasks - Array of objects of type tasks, to store all the tasks of our system
  @property {[categories]}  categories
  @property {[users]}  users
*/
class InformationTasks {
    constructor(id) {
        this.id = id;
        this.tasks = [];
        this.categories = [];
        this.users = [];
    }
    showHome() {
        /** Update the title */
        document.getElementById("headerTitle").textContent="Home";

        /** Clear the content */
        document.getElementById("divInformation").style.display="none";    
        //document.getElementById("formUser").style.display = "none";
        document.getElementById("formTask").style.display = "none";
    }
    /**
     * Show the task table
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
            document.getElementById("taskModalTitle").innerHTML = "Delete Task";
            loadTask("delete");
        }

        /**
         * Function to handle the insert event
         */
        function newTaskEventHandler() {
            document.getElementById('formTask').style.display = "block";
            document.getElementById('deleteTask').style.display = "none";
            document.getElementById('formTask').action = 'javascript:infoTasks.processingTask("create");';
            document.getElementById("taskModalTitle").innerHTML = "New Task";
            const button = document.getElementById('insertNew');
            button.setAttribute('data-bs-toggle', 'modal');
            button.setAttribute('data-bs-target', '#myModalTask');
            setupForm();
        }

        /**
         * Function to handle the update event
         */
        function updateTaskEventHandler() {
            document.getElementById('formTask').style.display = "block";
            document.getElementById('deleteTask').style.display = "none";
            document.getElementById('formTask').action = 'javascript:infoTasks.processingTask("update");';
            document.getElementById("taskModalTitle").innerHTML = "Update Task";
            const button = document.getElementById('updateData');
            button.setAttribute('data-bs-toggle', 'modal');
            button.setAttribute('data-bs-target', '#myModalTask');
            //cleanCanvasUser();
            loadTask("update");
        }

        /**
         * Function to set up the tasks's form
         */
        function setupForm(){
            document.getElementById('formTask').style.display = 'block';
            document.getElementById('formTask').reset();
            document.getElementById('categoryTask').options.length = 0;
            document.getElementById('userTask').options.length = 0;

            self.categories.forEach ( (e) => {
                document.getElementById('categoryTask').options.add(new Option(e.categoryName));
            });

            self.users.forEach ( (e) => {
                document.getElementById('userTask').options.add(new Option(e.userFullName));
            });
        }

        /**
         * Function to load a tasks's information into a form
         * 
         * @param {*} type 
         */
        function loadTask(type){
            document.getElementById('formTask').reset();
            document.getElementById('categoryTask').options.length = 0;
            document.getElementById('userTask').options.length = 0;

            self.categories.forEach ( (e) => {
                document.getElementById('categoryTask').options.add(new Option(e.name));
            });

            self.users.forEach ( (e) => {
                document.getElementById('userTask').options.add(new Option(e.fullName));
            });

            if(type === "delete"){
                if (selected(document.getElementById("taskTable"), "tasks", "delete"))
                document.getElementById('formTask').style.display = 'none';
            }
            else if(type === "update"){
                if (selected(document.getElementById("taskTable"), "tasks", "update"))
                document.getElementById('formTask').style.display = 'block';
            }
        }
        
        var divButtons = document.createElement('div');
        divButtons.id = 'divButtons';
        document.getElementById("divInformation").appendChild(divButtons);

        createButton("divButtons", updateTaskEventHandler, 'Update');
        //let type = localStorageObter("type");
        //if (type === "Admin") {
        createButton("divButtons", newTaskEventHandler, 'New');
        createButton("divButtons", deleteTaskEventHandler, 'Delete');
            //createButton("divInformation", selectAllClientEventHandler, 'Select All');
        //}
    }

    /**
     * Function that has as main goal to request to the NODE.JS server the resource categories by id through the GET verb, using asynchronous requests and JSON
     */
     getCategories() {
        let categories = this.categories;
        categories.length = 0;
        var xhr = new XMLHttpRequest();
        xhr.responseType="json";
        xhr.open("GET", "/categories", true);
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let info = xhr.response.category;
                info.forEach(c => {
                    categories.push(c);
                });
            }
        };
        xhr.send();
    }

    /**
     * Function that has as main goal to request to the NODE.JS server the resource users by id through the GET verb, using asynchronous requests and JSON
     */
     getUsers() {
        let users = this.users;
        users.length = 0;
        var xhr = new XMLHttpRequest();
        xhr.responseType="json";
        xhr.open("GET", "/users", true);
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let info = xhr.response.user;
                info.forEach(c => {
                    users.push(c);
                });
            }
        };
        xhr.send();
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
                this.postTask(formTask);
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
     * Function to insert a task
     * 
     * @param {*} formTask - tasks's form with all the information
     */
     postTask(formTask){
        const self = this;
        let formData = new FormData();
        formData.append('formClient', JSON.stringify(formTask));

        const xhr = new XMLHttpRequest();
        xhr.responseType="json";
        xhr.open('POST', '/task');
        
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                let info = xhr.response.task;
                self.showTasks("selectAll");
            }
        }
        //xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(formData);
    } 
    
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