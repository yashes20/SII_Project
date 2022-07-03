/* 
 * Copyright (C) 1883 Thomas Edison - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the XYZ license, which unfortunately won't be
 * written for another century.
 *
 * You should have received a copy of the XYZ license with
 * this file. If not, please write to: , or visit :
 * 
 * Authors: Nicole Fernandes, Nicole Vieira (201700124) and Yasmin Hage (202100778)
 * 
 * Emails: 201700124@estudantes.ips.pt and 202100778@estudantes.ips.pt 
 */
"use strict";

/** 
* @class Structure with capacity to store the login
* @constructs InformationLogin
  @param {string} id - id of the HTML element that contains the information.
  @property  {string} email - client's username
  @property  {string} password - client's password
*/
class InformationLogin {
    constructor(id) {
        this.id = id;
        this.email = email;
        this.password = password;
        
    }

    /**
     * Function that inserts or updates the resource person with a request to the NODE.JS server through the POST or PUT verb, using asynchronous requests and JSON
     */
     processingLogin () {

        const email = document.getElementById('email_login').value;
        const password = document.getElementById('password_login').value;

        let args = [];
        args.push(email);
        args.push(password);

        if (validadeForm(args)){
            let login = {
                "email" : email,
                "password" : password
            }
            this.postLogin(login);
        }
        
    }

    /**
     * Function that has as main goal to request to the NODE.JS server the login validation resource through the GET verb, using asynchronous requests and JSON
     */
    postLogin(formLogin) {
        let self = this;
        var xhr = new XMLHttpRequest();
        xhr.responseType="json";
        xhr.open('POST', '/api/login/');
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                let retorno = xhr.response.token;
                if (retorno.trim().length != 0) {
                    let token = xhr.response.token;
                    let user = xhr.response.user;

                    sessionStorageGravar("email_login",formLogin.email);
                    sessionStorageGravar("token", token);
                    sessionStorageGravar("userType", user.userType);
                    
                    alert("Login ok!");
                    self.showHomeLogin();

                    return true;
                }alert("Login Not ok!");
                sessionStorageLimpar("email_login");
                sessionStorageLimpar("token");
                return false;            
            }
        };
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(formLogin));
    }

    /**
     * Function that removes session storage 
    */
    logOff() {
        //isLoggedIn();
        sessionStorageLimpar("email_login");
        sessionStorageLimpar("token");
        sessionStorageLimpar("userType");

        document.getElementById("menuLogin").style.display = "none";
        document.getElementById("divInformation").style.display="none";    
        document.getElementById("formUser").style.display = "none";
        document.getElementById("formTask").style.display = "none";
        location.reload();
    }

    /**
     * Function to show the login form
     */
    showHomeLogin() {
        /* isLoggedIn(); */
        document.getElementById("headerTitle").textContent="Home";
        document.getElementById("divInformation").style.display="none";    
        document.getElementById("formUser").style.display = "none";
        document.getElementById("formTask").style.display = "none";
        document.getElementById("sectionLogin").style.display = "none";

        if (sessionStorageObter("email_login") === null) {
                document.getElementById("formLogin").style.display = "block";
                document.getElementById("menuLogin").style.display = "none";
        }
        else {
                document.getElementById("formLogin").style.display = "none";
                document.getElementById("menuLogin").style.display = "block";
                document.getElementById("sectionLogin").style.display = "none";
                document.getElementById("menuLogin").textContent = "Log Off";
        }
    }

}