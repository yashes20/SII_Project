/* 
 * Copyright (C) 1883 Thomas Edison - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the XYZ license, which unfortunately won't be
 * written for another century.
 *
 * You should have received a copy of the XYZ license with
 * this file. If not, please write to: , or visit :
 * 
 * Authors: Pedro Freitas, Nicole Fernandes, Nicole Vieira (201700124) and Yasmin Hage (202100778)
 * 
 * Emails: 201700124@estudantes.ips.pt and 202100778@estudantes.ips.pt 
 */
"use strict";

/** 
* @class Structure with capacity to store the user
* @constructs User
* @param {int} id - user's id
* @param {string} fullName - user's full name
* @param {Date} birthDate - user's birthdate
  @param {string} address - user's address
  @param {string} zipCode - user's zipcode
  @param {string} email - user's email
  @param {string} gender - user's gender
  @param {string} phone - user's phone number
*/
class User {
    constructor(id, fullName, birthDate, address, zipCode, email, gender, phone) {
        this.id = id;
        this.fullName = fullName;
        this.birthDate = birthDate;
        this.address = address;
        this.zipCode = zipCode;
        this.email = email;
        this.gender = gender;
        this.phone = phone;
    }
}