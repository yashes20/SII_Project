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
* @class Structure with capacity to store the task
* @constructs Task
* @param {int} id - task's id
* @param {string} name - task name
  @param {string} description - task's description
* @param {Date} dateCreation - task's date creation
  @param {Status} status - task's status
  @param {Date} dateStatus - task's date status
  @param {category} category- task's category description
  @param {string} isEnabled - task's isEnabled
  @param {User} userCreation - task's user creation description
  @param {User} userAssignmen - task's user Assignment description
  @param {Date} dateAssignment - task's date Assignment 
  @param {string} address - task's taskAddress
  @param {float} latitude - task's taskLatitude
  @param {float} longitude - task's taskLongitude


*/
class Task {
    constructor(id, name, description, dateCreation, status, dateStatus, category, isEnabled, userCreation, userAssignment, dateAssignment,address,latitude,longitude ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.dateCreation = dateCreation;
        this.status = status;
        this.dateStatus = dateStatus;
        this.category = category;
        this.isEnabled = isEnabled;
        this.userCreation = userCreation;
        this.userAssignment = userAssignment;
        this.dateAssignment = dateAssignment;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}