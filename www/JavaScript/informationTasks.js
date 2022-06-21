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
  @property {[status]}  status
  @property {[categories]}  categories
  @property {[users]}  users
*/
class InformationTasks {
    constructor(id) {
        this.id = id;
        this.tasks = [];
        this.status = [];
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
        } else if (acao === "status") {
            infoTasks.getTaskByStatusId("1"); 
        } else if (acao === "user") {
            infoTasks.getTaskByUserId("1");
        }
        /** Update the title */
        document.getElementById("headerTitle").textContent="Tasks";
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
            document.getElementById('associationTask').style.display = "none";
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
            document.getElementById('associationTask').style.display = "none";
            document.getElementById('formTask').action = 'javascript:infoTasks.processingTask("update");';
            document.getElementById("taskModalTitle").innerHTML = "Update Task";
            const button = document.getElementById('updateData');
            button.setAttribute('data-bs-toggle', 'modal');
            button.setAttribute('data-bs-target', '#myModalTask');
            //cleanCanvasUser();
            loadTask("update");
        }

        /**
         * Function to handle the update event
         */
         function AssignmentTaskEventHandler() {
            document.getElementById('associationTask').style.display = "block";
            document.getElementById('formTask').style.display = "none";
            document.getElementById('deleteTask').style.display = "none";
            document.getElementById('associationTask').style.display = "none";
            document.getElementById('formTask').action = 'javascript:infoTasks.processingTask("assignment");';
            document.getElementById("taskModalTitle").innerHTML = "Assignment Task";
            const button = document.getElementById('updateData');
            button.setAttribute('data-bs-toggle', 'modal');
            button.setAttribute('data-bs-target', '#myModalTask');
            //cleanCanvasUser();
            loadTask("assignment");
        }


        /**
         * Function to set up the tasks's form
         */
        function setupForm(){
            document.getElementById('formTask').style.display = 'block';
            document.getElementById('formTask').reset();
            document.getElementById('categoryTask').options.length = 0;
            document.getElementById('userTask').options.length = 0;
            document.getElementById('userAssignment').options.length = 0;
            document.getElementById('statusTask').options.length = 0;

            self.status.forEach ( (e) => {
                document.getElementById('statusTask').options.add(new Option(e.statusName,e.statusId));
            });

            document.getElementById("statusTask").setAttribute("readonly", "readonly");

            self.categories.forEach ( (e) => {
                console.log(e.categoryId);
                document.getElementById('categoryTask').options.add(new Option(e.categoryName,e.categoryId));
            });

            self.users.forEach ( (e) => {
                document.getElementById('userTask').options.add(new Option(e.userFullName,e.userId));
            });
            
            document.getElementById('userAssignment').options.add(new Option(""));
            self.users.forEach ( (e) => {
                document.getElementById('userAssignment').options.add(new Option(e.userFullName,e.userId));
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
            document.getElementById('userAssignment').options.length = 0;
            document.getElementById('statusTask').options.length = 0;

            self.status.forEach ( (e) => {
                document.getElementById('statusTask').options.add(new Option(e.statusName,e.statusId));
            });

            self.categories.forEach ( (e) => {
                document.getElementById('categoryTask').options.add(new Option(e.categoryName,e.categoryId));
            });

            self.users.forEach ( (e) => {
                document.getElementById('userTask').options.add(new Option(e.userFullName,e.userId));
            });

            document.getElementById('userAssignment').options.add(new Option(""));
            self.users.forEach ( (e) => {
                document.getElementById('userAssignment').options.add(new Option(e.userFullName,e.userId));
            }); 

            if(type === "delete"){
                if (selected(document.getElementById("taskTable"), "tasks", "delete"))
                document.getElementById('formTask').style.display = 'none';
            }
            else if(type === "update"){
                if (selected(document.getElementById("taskTable"), "tasks", "update"))
                document.getElementById('associationTask').style.display = 'none';
                document.getElementById('formTask').style.display = 'block';
            }
            else if(type === "assignment"){
                if (selected(document.getElementById("taskTable"), "tasks", "assignment"))
                document.getElementById('formTask').style.display = 'none';
                document.getElementById('associationTask').style.display = 'block';
            }
        }
        
        var divButtons = document.createElement('div');
        divButtons.id = 'divButtons';
        document.getElementById("divInformation").appendChild(divButtons);

        createButton("divButtons", updateTaskEventHandler, 'Update');
        createButton("divButtons", newTaskEventHandler, 'New');
        createButton("divButtons", deleteTaskEventHandler, 'Delete');
        createButton("divButtons", AssignmentTaskEventHandler, 'Assignment');
    }

    /**
     * Function that has as main goal to request to the NODE.JS server the resource categories by id through the GET verb, using asynchronous requests and JSON
     */
    getStatus() {
        let status = this.status;
        status.length = 0;
        var xhr = new XMLHttpRequest();
        xhr.responseType="json";
        xhr.open("GET", "/status", true);
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let info = xhr.response.status;
                info.forEach(c => {
                    status.push(c);
                });
            }
        };
        xhr.send();
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
        xhr.open('GET', '/tasks/users/' + id, true);
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let info = xhr.response.task;
                info.forEach(p => {
                    tasks.push(p);
                });
                self.showTasks("selectAll");
            }
        };
        xhr.send(tableElement);
    }

    /**
     * Function that has as main goal to request to the NODE.JS server the resource task by id through the GET verb, using asynchronous requests and JSON
     */
     async getTaskByStatusId(id) {
        const self = this;
        var tableElement = document.getElementById("taskTable");
        tableElement = document.createElement("table");
        tableElement.setAttribute("id", "taskTable");

        let tasks = this.tasks;
        tasks.length = 0;
        var xhr = new XMLHttpRequest();
        xhr.responseType="json";
        xhr.open('GET', '/tasks/status/' + id, true);
        xhr.onreadystatechange = function () {
            if (this.readyState === 4  && this.status === 200) {
                let info = xhr.response.task;
                info.forEach(p => {
                    tasks.push(p);
                });
                self.showTasks("selectAll");
            }
        };
        xhr.send(tableElement);
    } 

    /**
     * Function that inserts or updates the resource user with a request to the NODE.JS server through the POST or PUT verb, using asynchronous requests and JSON
     * @param {String} acao - controls which CRUD operation we want to do
     */
    processingTask (acao) {

        const id = parseInt(document.getElementById('idTask').value);
        const name = document.getElementById('taskName').value;
        const description = document.getElementById('descriptionTask').value;

        const categoryList = document.getElementById('categoryTask');
        const idcategory = categoryList.options[categoryList.selectedIndex].value;

        const userCreationList = document.getElementById('userTask');
        const idUserCreation = userCreationList.options[userCreationList.selectedIndex].value;

        const statusList = document.getElementById('statusTask');
        const idStatusf = statusList.options[statusList.selectedIndex].value;

        const dateAssignment = document.getElementById('dateAssignment').value;
        const address = document.getElementById('addressTask').value;
        const latitude = parseFloat(document.getElementById('taskLatitude').value);
        const longitude = parseFloat(document.getElementById('taskLongitude').value);
        var idStatus =idStatusf;
        var formTask ="";

        let args = [];

        if (acao == "create"){ 
            args.push(name);
            args.push(description);
            args.push(idcategory);
            args.push(idUserCreation);
            args.push(address);

            formTask= new postTask(name,description, idcategory, idUserCreation, dateAssignment, address, latitude, longitude);

        } else if (acao == "update") {

            const userAssignmentList = document.getElementById('userAssignment');
            var iduserAssignment = userAssignmentList.options[userAssignmentList.selectedIndex].value;

            let table = document.getElementById("taskTable");
            let selecteds = table.getElementsByClassName("selecionado");

            var taskOld = selecteTaskOldValues(selecteds);

            if (iduserAssignment != "" && (taskOld.userAssignment == "" ||taskOld.userAssignment == undefined) ) {
                idStatus = "2";
            }

            if (iduserAssignment === ""){
                iduserAssignment = null;
            }

            args.push(name);
            args.push(description);
            args.push(idcategory);
            args.push(idUserCreation);
            args.push(address);
            args.push(idStatus);

            formTask = new putTask(id, name,description, idStatus, idcategory, idUserCreation, iduserAssignment, dateAssignment, address, latitude, longitude);

        }

        if (acao === 'create') {
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
        const xhr = new XMLHttpRequest();
        xhr.responseType="json";
        xhr.open('POST', '/tasks');
        
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                let info = xhr.response.task;
                self.showTasks("selectAll");
            }
        }
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(formTask));
       
    }

    /**
     * Function to update a task
     * 
     * @param {*} formTask - tasks's form with all the information
     */
     putTask(formTask){
        const self = this;
        const xhr = new XMLHttpRequest();
        xhr.responseType="json";
        xhr.open('PUT', '/tasks/' + formTask.id);
        
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                let info = xhr.response.task;
                self.showTasks("selectAll");
            }
        }
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(formTask));
    } 
    
    /**
     * Function to delete an existing task
     * 
     * @param {*} formTask - tasks's form with all the information
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