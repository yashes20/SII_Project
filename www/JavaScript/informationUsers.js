/* 
 * Copyright (C) 1883 Thomas Edison - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the XYZ license, which unfortunately won't be
 * written for another century.
 *
 * You should have received a copy of the XYZ license with
 * this file. If not, please write to: , or visit :
 * 
 * Authors: Nicole Vieira (201700124) Nicole Fernandes and Yasmin Hage (202100778)
 * 
 * Emails: 201700124@estudantes.ips.pt and 202100778@estudantes.ips.pt 
 */
"use strict";

//const { sendFile } = require("express/lib/response");

/** 
* @class Saves all the information about the user
* @constructs InformationUsers
* @param {string} id - id of the HTML element that contains the information.
* 
* @property {string} id - id of the HTML element that contains the information.
* @property {user[]} users - Array of objects of type client, to store all the people of our system
  @property {string[]} genders - Array of objects of the gender type, to store all the people in our system
*/
class InformationUsers {
    constructor(id) {
        this.id = id;
        this.users = [];
        this.genders = ['F', 'M', 'N'];
    }

    /**
     * Show the users table
     * 
     * @param {*} acao - if is delete, insert or update
     * @returns 
     */
    showUsers(acao) {
        let self = this;

        //document.getElementById("catalogProducts").style.display = "none";

        // permission to see all customers
        if (acao === "select") {
            infoUsers.getUsers();
        }
        /** Update the title */
        document.getElementById("headerTitle").textContent = "Users";
        document.getElementById("sectionLogin").style.display = "none";
        document.getElementById("formLogin").style.display = "none";
        // if (sessionStorageObter("username_login")  === null) {
        //     document.getElementById("divInformation").style.display="none";
        //     return;
        // }
        // else {
        document.getElementById("divInformation").style.display = "block";
        //}
        // document.getElementById("demo").style.display = "none";


        let cleanDiv = document.createElement("div");
        replaceChilds("divInformation", cleanDiv);

        let userTable = document.createElement("table");
        userTable.setAttribute("id", "userTable");
        let th = tableLine(new User(), true);
        userTable.appendChild(th);
        this.users.forEach(p => {
            let tr = tableLine(p);
            userTable.appendChild(tr);
        });
        replaceChilds("divInformation", userTable);

        var table = document.getElementById("userTable");
        var rows = table.getElementsByTagName("tr");

        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];

            row.addEventListener("click", function () {
                //Add to the current
                selLinha(this, false); //Select only one
                //selLinha(this, true); //Select multiple
            });
        }

        // Show content

        /**
         * Function to handle the delete event
         */
        function deleteUserEventHandler() {
            document.getElementById('formUser').style.display = "none";
            document.getElementById('deleteUser').style.display = "block";
            document.getElementById('deleteUser').action = 'javascript:infoUsers.processingUser("delete");';
            document.getElementById("userModalTitle").innerHTML = "Delete user";
            loadUser("delete");
        }

        /**
         * Function to handle the insert event
         */
        function newUserEventHandler() {
            document.getElementById('formUser').style.display = "block";
            document.getElementById('deleteUser').style.display = "none";
            document.getElementById('formUser').action = 'javascript:infoUsers.processingUser("create");';
            document.getElementById("userModalTitle").innerHTML = "New User";
            const button = document.getElementById('insertNew');
            button.setAttribute('data-bs-toggle', 'modal');
            button.setAttribute('data-bs-target', '#myModalUser');
            setupForm();
        }

        /**
         * Function to handle the update event
         */
        function updateUserEventHandler() {
            document.getElementById('formUser').style.display = "block";
            document.getElementById('deleteUser').style.display = "none";
            document.getElementById('formUser').action = 'javascript:infoUsers.processingUser("update");';
            document.getElementById("userModalTitle").innerHTML = "Update User";
            const button = document.getElementById('updateData');
            button.setAttribute('data-bs-toggle', 'modal');
            button.setAttribute('data-bs-target', '#myModalUser');
            //cleanCanvasUser();
            loadUser("update");
        }

        /**
         * Function to set up the client's form
         */
        function setupForm() {
            document.getElementById('formUser').style.display = 'block';
            document.getElementById('formUser').reset();
            //document.getElementById('formClient').innerHTML = '';
            document.getElementById('gender').options.length = 0;

            self.genders.forEach((e) => {
                document.getElementById('gender').options.add(new Option(e));
            });
        }

        /**
         * Function to load a client's information into a form
         * 
         * @param {*} type 
         */
        function loadUser(type) {
            document.getElementById('formUser').reset();

            document.getElementById('gender').options.length = 0;
            self.genders.forEach((e) => {
                document.getElementById('gender').options.add(new Option(e));
            });


            if (type === "delete") {
                if (selected(document.getElementById("userTable"), "users", "delete"))
                    document.getElementById('formUser').style.display = 'none';
            }
            else if (type === "update") {
                if (selected(document.getElementById("userTable"), "users", "update"))
                    document.getElementById('formUser').style.display = 'block';
            }
        }

        var divButtons = document.createElement('div');
        divButtons.id = 'divButtons';
        document.getElementById("divInformation").appendChild(divButtons);

        createButton("divButtons", updateUserEventHandler, 'Update User');
        createButton("divButtons", newUserEventHandler, 'New User');
        createButton("divButtons", deleteUserEventHandler, 'Delete User');


    }

    /**
     * Function that has as main goal to request to the NODE.JS server the user resource through the GET verb, using asynchronous requests and JSON
     */
    getUsers() {
        const self = this;
        let users = this.users;
        users.length = 0;
        var tableElement = document.getElementById("userTable");
        tableElement = document.createElement("table");
        tableElement.setAttribute("id", "userTable");
        var xhr = new XMLHttpRequest();
        xhr.responseType = "json";
        xhr.open("GET", "/users", true);
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let info = xhr.response.user;
                info.forEach(p => {
                    users.push(p);
                });
                self.showUsers("selectAll");
            }
        };
        xhr.send(tableElement);

    }

    /**
     * Function that has as main goal to request to the NODE.JS server the resource user by id through the GET verb, using asynchronous requests and JSON
     */
    getUserById(id) {
        const self = this;
        var tableElement = document.getElementById("userTable");
        tableElement = document.createElement("table");
        tableElement.setAttribute("id", "userTable");

        let users = this.users;
        users.length = 0;
        var xhr = new XMLHttpRequest();
        xhr.responseType = "json";
        xhr.open('GET', '/userById/' + id, true);
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let info = xhr.response.user;
                info.forEach(p => {
                    users.push(p);
                });
                self.showUsers("select");
            }
        };
        xhr.send(tableElement);
    }

    /**
     * Function that inserts or updates the resource user with a request to the NODE.JS server through the POST or PUT verb, using asynchronous requests and JSON
     * @param {String} acao - controls which CRUD operation we want to do
     */
    processingUser(acao) {

        const id = parseInt(document.getElementById('id').value);
        const userFullName = document.getElementById('name').value;
        const password = document.getElementById('password').value;
        const address = document.getElementById('address').value;
        const zipCode = document.getElementById('zipcode').value;
        const email = document.getElementById('email').value;
        const genderList = document.getElementById('gender');
        const idgender = genderList.options[genderList.selectedIndex].value;
        const phone = document.getElementById('phone').value;
        const birthDate = document.getElementById('birthdate').value;

        let args = [];
        args.push(userFullName);
        args.push(email);
        args.push(idgender);

        const formUser = new FormUser(id, userFullName, password, birthDate, address, zipCode, email, idgender, phone);
        if (acao === 'create') {
            args.push(password);
            if (validadeForm(args)) {
                this.postUser(formUser);
            }
        } else if (acao === 'update') {
            if (validadeForm(args)) {
                this.putUser(formUser);
            }

        } else if (acao === 'delete') {
            this.deleteUser(formUser);
        }
    }

    /**
     * Function to insert a new user
     * 
     * @param {*} formUser - user's form with all the information
     */
    postUser(formUser) {
        const self = this;
        const xhr = new XMLHttpRequest();
        xhr.responseType = "json";
        xhr.open('POST', '/api/register/');

        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                let resp = xhr.response;
                let id = xhr.response.user.insertId;
                //self.getClientById(id);
                self.showUsers("select");
            }
        }
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(formUser));
    }

    /**
     * Function to update user
     * 
     * @param {*} formUser - user's form with all the information
     */
    putUser(formUser) {
        const self = this;
        const xhr = new XMLHttpRequest();
        xhr.responseType = "json";
        xhr.open('PUT', '/users/' + formUser.id);

        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                self.showUsers("select");
            }
        }
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(formUser));
    }

    /**
     * Function to delete an existing user, only change status 
     * 
     * @param {*} formUser - users's form with all the information
     */
    deleteUser(formUser) {
        const self = this;
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', '/users/' + formUser.id);
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                self.users.splice(self.users.findIndex(i => i.userId === formUser.id), 1);
                self.showClients("select");
            }
        };
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(formUser));
    }
}