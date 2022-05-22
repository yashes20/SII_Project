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
* @class Structure with capacity to create task
* @constructs putTask
* @param {string} name - task name
  @param {string} description - task's description
  @param {Category} category - task's category
  @param {User} userCreation - task's user creation
  @param {User} userAssignment - task's user userAssignment
  @param {string} address - task's taskAddress
  @param {number} latitude - task's taskLatitude
  @param {number} longitude - task's taskLongitude


*/
class putTask {
    constructor( name, description, category, userCreation, userAssignment, address,latitude,longitude ) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.userCreation = userCreation;
        this.userAssignment = userAssignment;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}