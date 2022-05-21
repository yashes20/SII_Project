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
* @param {string} taskName - task name
  @param {string} description - task's description
* @param {Date} dateCreation - task's date creation
  @param {string} status - task's status
  @param {Date} dateStatus - task's date status
  @param {Category} category - task's category
  @param {User} userCreation - task's user creation
  @param {string} taskAddress - task's taskAddress
  @param {float} taskLatitude - task's taskLatitude
  @param {float} taskLongitude - task's taskLongitude


*/
class Task {
    constructor(id, taskName, description, dateCreation, status, dateStatus, category, userCreation,taskAddress,taskLatitude,taskLongitude ) {
        this.id = id;
        this.taskName = taskName;
        this.description = description;
        this.dateCreation = dateCreation;
        this.status = status;
        this.dateStatus = dateStatus;
        this.category = category;
        this.userCreation = userCreation;
        this.taskAddress = taskAddress;
        this.taskLatitude = taskLatitude;
        this.taskLongitude = taskLongitude;
    }
}