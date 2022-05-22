/* 
 * Copyright (C) 1883 Thomas Edison - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the XYZ license, which unfortunately won't be
 * written for another century.
 *
 * You should have received a copy of the XYZ license with
 * this file. If not, please write to: , or visit :
 * 
 * Authors: Pedro Freitas, Nicole Vieira (201700124), Nicole Fernandes and Yasmin Hage (202100778)
 * 
 * Emails: 201700124@estudantes.ips.pt and 202100778@estudantes.ips.pt 
 */
"use strict";

/** 
* @class Structure with capacity to store the task
* @constructs Task
* @param {int} id - task's id
* @param {string} name - task name
  @param {string} description - task's description
* @param {Date} dateCreation - task's date creation
  @param {int} idStatus - task's status
  @param {string} status - task's status
  @param {Date} dateStatus - task's date status
  @param {Category} category - task's category
  @param {string} isEnabled - task's isEnabled
  @param {User} userCreation - task's user creation
  @param {User} userAssignment - task's user Assignment
  @param {string} address - task's taskAddress
  @param {float} latitude - task's taskLatitude
  @param {float} longitude - task's taskLongitude


*/
class Task {
    constructor(id, name, description, dateCreation, idStatus, status, dateStatus, category, isEnabled, userCreation, userAssignment, address,latitude,longitude ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.dateCreation = dateCreation;
        this.idStatus = idStatus;
        this.status = status;
        this.dateStatus = dateStatus;
        this.category = category;
        this.isEnabled = isEnabled;
        this.userCreation = userCreation;
        this.userAssignment = userAssignment;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}