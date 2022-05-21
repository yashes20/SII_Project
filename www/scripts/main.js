/* 
 * Copyright (C) 1883 Thomas Edison - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the XYZ license, which unfortunately won't be
 * written for another century.
 *
 * You should have received a copy of the XYZ license with
 * this file. If not, please write to: , or visit :
 * 
 * Authors: Pedro Vieira, Nicole Vieira (201700124) and Yasmin Hage (202100778)
 * 
 * Emails: 201700124@estudantes.ips.pt and 202100778@estudantes.ips.pt 
 */
"use strict";

/**
 * Function that will be executed when the page is fully loaded, creating the global variable "info" with an Information object
 * We also take the opportunity to ask the server to load data asynchronously (AJAX)
 * @memberof window
 * @params {Event} event - object that will represent the event
 */
window.onload = function (event) {
    var infoUsers = new InformationUsers("divInformation");
    var infoTasks = new InformationTasks("divInformation");
    //var infoProducts = new InformationProducts("divInformation");
    //infoClients.getClients();
    infoTasks.getCategories();
    infoTasks.getUsers();
    window.infoUsers = infoUsers;
    window.infoTasks = infoTasks;

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
    args.forEach(function(item,index,array) {
        if (item.trim() === "" || item == null)
            result = false;
    });
    if (!result) {
        alert("todos os parametros devem ser preenchidos!");
        return false;
    }
    else {return true;}
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
function selLinha(linha, multiplos){
    if(!multiplos){
        var linhas = linha.parentElement.getElementsByTagName("tr");
          for(var i = 0; i < linhas.length; i++){
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
function selectedUser(selecteds){
    for(var i = 0; i < selecteds.length; i++){
        var selected = selecteds[i];
        selected = selected.getElementsByTagName("td");

        document.getElementById("id").value = selected[0].textContent;
        document.getElementById('name').value = selected[1].textContent;
        document.getElementById('username').value = selected[2].textContent;
        document.getElementById("username").setAttribute("readonly", "readonly");
        document.getElementById('birthdate').value = selected[3].textContent;
        document.getElementById('address').value = selected[4].textContent;
        document.getElementById('zipcode').value = selected[5].textContent;
        document.getElementById('email').value = selected[6].textContent;
        document.getElementById('gender').value= selected[7].textContent;    
        document.getElementById('phone').value = selected[8].textContent;
    }
}

/**
 * Function to get all the information of the selected task
 * 
 * @param {*} selecteds 
 */
 function selectedTask(selecteds){
   
     for(var i = 0; i < selecteds.length; i++){
        var selected = selecteds[i];
         selected = selected.getElementsByTagName("td");

         document.getElementById('id').value = selected[0].textContent;
         document.getElementById("id").setAttribute("readonly", "readonly");
         document.getElementById('taskName').value = selected[1].textContent;
         document.getElementById('descriptionTask').value = selected[2].textContent;
         var category = document.getElementById("categoryTask");
         document.getElementById('categoryTask').options[category.selectedIndex].textContent = selected[6].textContent;
         var user = document.getElementById("userTask");
         document.getElementById('userTask').options[user.selectedIndex].textContent = selected[7].textContent;
         document.getElementById('addressTask').value = selected[8].textContent;
     }
 }

/**
 * Function that returns the id of the selected line
 * 
 * @param {*} tableObj 
 * @param {*} tableName - if it's the product's table or client's table
 * @param {*} type - if the button clicked is for delete or update
 * @returns 
 */
function selected(tableObj, tableName, type){
    //let table = document.getElementById("clientTable");
    let table = tableObj;
	let selecteds = table.getElementsByClassName("selecionado");
    
    let button = "";

    if(type === "delete"){
        button = document.getElementById('deleteData');
    }
    else if(type === "update"){
        button = document.getElementById('updateData');
    }

    //Check that it is selected
    if(selecteds.length < 1){
  	    alert("Selecione pelo menos uma linha");
        return false;
    }

    if(tableName === "users"){
        selectedUser(selecteds);
        
        button.setAttribute('data-bs-toggle', 'modal');
        button.setAttribute('data-bs-target', '#myModalUser');
    }
    else if(tableName === "tasks"){
        selectedTask(selecteds);

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
    if(value.includes('New')){
        button.classList.add("btn", "btn-success");
        button.id = 'insertNew';
    } else if (value.includes('Update')){
        button.classList.add("btn", "btn-primary");
        button.id = 'updateData';
    } else if (value.includes('Delete')){
        button.classList.add("btn", "btn-danger");
        button.id = 'deleteData';
    }
    button.type = 'button';
    button.value = value;
    button.addEventListener('click', eventHandler);
    fatherNode.appendChild(button);
}

/**
 * Function to save in the session storage
 * @param {*} arg 
 */
function sessionStorageGravar(arg) { 
    var text = document.getElementById(arg).value; 
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

/**
 * Function to save in the local storage
 * 
 * @param {*} arg 
 * @param {*} obj 
 */
function localStorageGravar(arg,obj) { 
    localStorage.setItem(arg, obj);
} 

/**
 * Function to select from the local storage
 * 
 * @param {*} arg 
 * @returns 
 */
function localStorageObter(arg) { 
    return localStorage.getItem(arg); 
} 

/**
 * Function to clean from the local storage
 * 
 * @param {*} arg 
 */
function localStorageLimpar(arg) { 
    localStorage.removeItem(arg);
    //document.getElementById("Data").value = ""; 
}

/**
 * Function to clean task's canvas
 */
function cleanCanvasTask(){
    let canvas = document.getElementById('canvasTask');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}



/**
 * Function to apply filter to the canvas
 * 
 * @param {*} c 
 */
function applyFilter(c){
    const canvas = document.getElementById(c);
    const canvasCtx = canvas.getContext('2d');
    const imgData = canvasCtx.getImageData(0,0, canvas.width, canvas.height);
    worker.postMessage(imgData);
}

/**
 * Function to process the image selected
 * 
 * @param {*} e 
 * @returns 
 */
function inputChangeProduct(e) {    
    
    if (e.target.files.length === 0)return;
        const file=e.target.files[0];
        processImage(file,"canvasProduct");
}

/**
 * Function to process the image selected into the canvas
 * 
 * @param {*} file 
 * @param {*} img 
 */
async function processImage(file, img){
    const bitmap = await createImageBitmap(file);
    // Load an image of intrinsic size 300x227 in CSS pixels
    const canvas = document.getElementById(img);
    const canvasCtx = canvas.getContext('2d');
    bitmap.onload = drawImageActualSize(canvas.width,canvas.height,canvasCtx);
    
    function drawImageActualSize(width,height) {
        // Use the intrinsic size of image in CSS pixels for the canvas element
        bitmap.resizeWidth =width;
        bitmap.resizeHeight =height;
        canvasCtx.drawImage(bitmap, 0, 0, width, height);
    }
    applyFilter(img);
}

/**
 * Function to add the div to the homepage in order to add the carousel
 * 
 * @param {*} category 
 * @param {*} task 
 * @param {*} image 
 * @param {*} count 
 */
function addDiv(task, product, image, count){
    /*let div = document.createElement("div");
    div.style.display = "inline-block";
    div.textContent = category + " " + product;*/

    let div = document.createElement("div");
    div.classList.add("carousel-item");
    if(count == 0){
        div.classList.add("active");
    }
    div.id = "divCarousel" + count;

    let img = document.createElement("img");
    img.src = image;
    img.classList.add("d-block");
    img.style.width = "100%";
    img.setAttribute("alt", category + " - " + task);
    
    //document.getElementById("divProductList").appendChild(div);
    document.getElementById("divTaskList").appendChild(div);
    document.getElementById("divCarousel" + count).appendChild(img);
}

/**
 * Function to add the tasks div to the tasks's page (user only)
 * 
 * @param {*} category 
 * @param {*} task 
 * @param {*} image 
 * @param {*} count 
 */
function addCatalogDiv(category, task, image, count){
    /*let div = document.createElement("div");
    div.style.display = "inline-block";
    div.textContent = category + " " + product;*/

    let div = document.createElement("div");
    div.classList.add("col-xs-6", "col-md-4");
    div.id = "divCatalog" + count;

    let divInside = document.createElement("div");
    divInside.classList.add("product", "tumbnail", "thumbnail-3");
    divInside.id = "divtask" + count;

    let img = document.createElement("img");
    img.src = image;
    img.setAttribute("alt", category + " - " + product);

    let divCaption = document.createElement("div");
    divCaption.classList.add("caption");
    divCaption.id = "divCaptionTask" + count;

    let textCaption = document.createElement("h6");
    textCaption.textContent = category + " - " + product;

    //document.getElementById("divProductList").appendChild(div);
    document.getElementById("TasksShow").appendChild(div);
    document.getElementById("divCatalog" + count).appendChild(divInside);
    document.getElementById("divTask" + count).appendChild(img);
    document.getElementById("divTask" + count).appendChild(divCaption);
    document.getElementById("divCaptionTask" + count).appendChild(textCaption);
}

/**
 * Function to check if the user is logged in
 */
function isLoggedIn(){
    if (sessionStorageObter("username_login") === null) {
        document.getElementById("menuHome").style.display = "none";
        document.getElementById("menuUser").style.display = "none";
        document.getElementById("menuLogin").style.display = "none";
        //document.getElementById("sectionLogin").style.display = "block";
    } else{
        document.getElementById("menuHome").style.display = "block";
        document.getElementById("menuTask").style.display = "block";
        document.getElementById("menuUser").style.display = "block";
        document.getElementById("menuLogin").style.display = "block";
        //document.getElementById("sectionLogin").style.display = "none";
    }
    //infoProducts.showHome();
}