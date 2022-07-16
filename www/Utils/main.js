/* 
 * Copyright (C) 1883 Thomas Edison - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the XYZ license, which unfortunately won't be
 * written for another century.
 *
 * You should have received a copy of the XYZ license with
 * this file. If not, please write to: , or visit :
 * 
 * Authors: Nicole Fernandes (201600093), Nicole Vieira (201700124) and Yasmin Hage (202100778)
 *
 * Emails: 201600093@estudantes.ips.pt, 201700124@estudantes.ips.pt and 202100778@estudantes.ips.pt 
 */
"use strict";

/**
 * Function that will be executed when the page is fully loaded, creating the global variable "info" with an Information object
 * We also take the opportunity to ask the server to load data asynchronously (AJAX)
 * @memberof window
 * @params {Event} event - object that will represent the event
 */

window.onload = function (event) {

    document.getElementById("divLogo").style.display = "none";

    var infoUsers = new InformationUsers("divInformation");
    var infoTasks = new InformationTasks("divInformation");
    var infoLogin = new InformationLogin("login");
    window.infoLogin = infoLogin;
    window.infoUsers = infoUsers;
    window.infoTasks = infoTasks;

    /** check user login */
    if (sessionStorageObter("email_login") === null) {
        return;
    }
    else {

        
        //var infoProducts = new InformationProducts("divInformation");
        //infoClients.getClients();
        infoTasks.getCategories();
        infoTasks.getUsers();
        infoTasks.getStatus();
        
        //login.logOff();
        

    }
    // isLoggedIn();

    // var login = new Login("login");
    // //login.logOff();
    // window.login = login;

};

/**
 * Function that validates if the fields of the form are filled (DOM facilitator)
 * @param {string[]} args - argument's array
 */
function validadeForm(args) {
    let result = true;
    args.forEach(function (item, index, array) {
        if (item.trim() === "" || item == null)
            result = false;
    });
    if (!result) {
        alert("fill all required fields!");
        return false;
    }
    else { return true; }
}

/**
 * Function that replaces all the child elements of an HTML element with a new HTML element (DOM facilitator)
 * @param {string} id - id of the HTML element for which you want to replace the children.
 * @param {HTMLElement} newSon - HTML element that will be the new child.
 */
function replaceChilds(id, newSon) {
    var no = document.getElementById(id);
    while (no.hasChildNodes()) {
        no.removeChild(no.lastChild);
    }
    no.appendChild(newSon);
};

/**
 * Function that receives any object and dynamically returns an HTML table row with information about the state of its properties
 * @param {Object} object - object of which we are going to transform the content of its attributes into lines
 * @param {boolean} headerFormat - controls whether the format is header or normal line
 */
function tableLine(object, headerFormat) {
    var tr = document.createElement("tr");
    var tableCell = null;
    for (var property in object) {
        if ((object[property] instanceof Function))
            continue;
        if (headerFormat) {
            tableCell = document.createElement("th");
            tableCell.textContent = property[0].toUpperCase() + property.substr(1, property.length - 1);
        } else {
            tableCell = document.createElement("td");
            tableCell.textContent = object[property];
        }
        tr.appendChild(tableCell);
    }
    return tr;
};

/**
 * Function to select a line
 * If true, then user can select multiple lines
 * If false, then user can only select one line
 * 
 * @param {*} linha 
 * @param {*} multiplos 
 */
function selLinha(linha, multiplos) {
    if (!multiplos) {
        var linhas = linha.parentElement.getElementsByTagName("tr");
        for (var i = 0; i < linhas.length; i++) {
            var linha_ = linhas[i];
            linha_.classList.remove("selecionado");
        }
    }
    linha.classList.toggle("selecionado");
}

/**
 * Function to get all the information about the selected user
 * 
 * @param {*} selecteds 
 */
function selectedUser(selecteds) {
    for (var i = 0; i < selecteds.length; i++) {
        var selected = selecteds[i];
        selected = selected.getElementsByTagName("td");

        document.getElementById("id").value = selected[0].textContent;
        document.getElementById('name').value = selected[1].textContent;
        document.getElementById('birthdate').value = selected[2].textContent;
        document.getElementById('address').value = selected[3].textContent;
        document.getElementById('zipcode').value = selected[4].textContent;
        document.getElementById('email').value = selected[5].textContent;
        document.getElementById('gender').value = selected[6].textContent;
        document.getElementById('phone').value = selected[7].textContent;
    }
}

/**
 * Function to get all the information of the selected task
 * 
 * @param {*} selecteds 
 */
function selectedTask(selecteds) {

    for (var i = 0; i < selecteds.length; i++) {
        var selected = selecteds[i];
        selected = selected.getElementsByTagName("td");

        document.getElementById('idTask').value = selected[0].textContent;
        document.getElementById("idTask").setAttribute("readonly", "readonly");
        document.getElementById('taskName').value = selected[1].textContent;
        document.getElementById('descriptionTask').value = selected[2].textContent;

        var status = document.getElementById("statusTask");
        status.value = selected[4].textContent;
        //document.getElementById('statusTask').options[category.selectedIndex].value = selected[4].textContent;

        var category = document.getElementById("categoryTask");
        //document.getElementById('categoryTask').options[category.selectedIndex].value = selected[7].textContent;
        category.value = selected[6].textContent;

        var user = document.getElementById("userTask");
        user.value = selected[8].textContent;
        //document.getElementById('userTask').options[user.selectedIndex].textContent = selected[11].textContent;

        var userAss = document.getElementById("userAssignment");
        userAss.value = selected[9].textContent;

        document.getElementById('dateAssignment').value = selected[10].textContent;
        document.getElementById('addressTask').value = selected[11].textContent;
        document.getElementById('taskLatitude').value = selected[12].textContent;
        document.getElementById('taskLongitude').value = selected[13].textContent;
    }
}

/**
* Function to get all the information of the selected task
* 
* @param {*} selecteds 
*/
function selectedTaskAssigment(selecteds) {

    for (var i = 0; i < selecteds.length; i++) {
        var selected = selecteds[i];
        selected = selected.getElementsByTagName("td");

        document.getElementById('idTaskAssoc').value = selected[0].textContent;
        document.getElementById("idTaskAssoc").setAttribute("readonly", "readonly");
        document.getElementById('taskNameAssoc').value = selected[1].textContent;
        document.getElementById('descriptionTaskAssoc').value = selected[2].textContent;
        var userAss = document.getElementById("userAssignmentAssoc");
        userAss.value = selected[9].textContent;
    }
}

/**
* Function to get all the information of the selected task
* 
* @param {*} selecteds 
*/
function selecteTaskOldValues(selecteds) {
    var oldTask = new putTask();
    for (var i = 0; i < selecteds.length; i++) {
        var selected = selecteds[i];
        selected = selected.getElementsByTagName("td");

        oldTask.id = selected[0].textContent;
        oldTask.status = selected[4].textContent;
        oldTask.userAssignment = selected[9].textContent;
    }
    return oldTask;
}

/**
 * Function that returns the id of the selected line
 * 
 * @param {*} tableObj 
 * @param {*} tableName - if it's the product's table or client's table
 * @param {*} type - if the button clicked is for delete or update
 * @returns 
 */
function selected(tableObj, tableName, type) {
    //let table = document.getElementById("clientTable");
    let table = tableObj;
    let selecteds = table.getElementsByClassName("selecionado");

    let button = "";

    if (type === "delete") {
        button = document.getElementById('deleteData');
    }
    else if (type === "update") {
        button = document.getElementById('updateData');
    }
    else if (type === "assignment") {
        button = document.getElementById('assignmentData');
    }
    //Check that it is selected
    if (selecteds.length < 1) {
        alert("Selecione pelo menos uma linha");
        return false;
    }

    if (tableName === "users") {
        selectedUser(selecteds);

        button.setAttribute('data-bs-toggle', 'modal');
        button.setAttribute('data-bs-target', '#myModalUser');
    }
    else if (tableName === "tasks") {
        selectedTask(selecteds);

        button.setAttribute('data-bs-toggle', 'modal');
        button.setAttribute('data-bs-target', '#myModalTask');
    }
    else if (tableName === "assignment") {
        selectedTaskAssigment(selecteds);

        button.setAttribute('data-bs-toggle', 'modal');
        button.setAttribute('data-bs-target', '#myModalTask');
    }

    return true;
}

/**
 * Generic function that creates an HTML button, gives it an event and places it in the node tree
 * @param {string} fatherNodeName - button parent node
 * @param {function} eventHandler - button event.
 * @param {String} value - button text
 */
function createButton(fatherNodeName, eventHandler, value) {
    let fatherNode = document.getElementById(fatherNodeName);
    const button = document.createElement('input');
    if (value.includes('New')) {
        button.classList.add("btn", "btn-success");
        button.id = 'insertNew';
    } else if (value.includes('Update')) {
        button.classList.add("btn", "btn-primary");
        button.id = 'updateData';
    } else if (value.includes('Delete')) {
        button.classList.add("btn", "btn-danger");
        button.id = 'deleteData';
    }
    else if (value.includes('Assignment')) {
        button.classList.add("btn", "btn-primary");
        button.id = 'assignmentData';
    }
    button.type = 'button';
    button.value = value;
    button.addEventListener('click', eventHandler);
    fatherNode.appendChild(button);
}

/**
 * Function to check if the user is logged in
 */
function isLoggedIn() {
    if (sessionStorageObter("username_login") === null) {
        document.getElementById("menuHome").style.display = "none";
        document.getElementById("menuUser").style.display = "none";
        document.getElementById("menuLogin").style.display = "none";
        //document.getElementById("sectionLogin").style.display = "block";
    } else {
        document.getElementById("menuHome").style.display = "block";
        document.getElementById("menuTask").style.display = "block";
        document.getElementById("menuUser").style.display = "block";
        document.getElementById("menuLogin").style.display = "block";
        //document.getElementById("sectionLogin").style.display = "none";
    }
}

/**
 * Function to save in the session storage
 * @param {*} arg 
 */
/*  function sessionStorageGravar(arg) { 
    var text = document.getElementById(arg).value; 
    sessionStorage.setItem(arg, text); 
}  */

/**
 * Function to save in the session storage
 * @param {*} arg 
 */
function sessionStorageGravar(arg, text) {
    sessionStorage.setItem(arg, text);
}

/**
 * Function to select from the session storage
 * 
 * @param {*} arg 
 * @returns 
 */
function sessionStorageObter(arg) {
    return sessionStorage.getItem(arg);
}

/**
 * Function to clean from the sesssion storage
 * 
 * @param {*} arg 
 */
function sessionStorageLimpar(arg) {
    sessionStorage.removeItem(arg);
    //document.getElementById("Data").value = ""; 
}