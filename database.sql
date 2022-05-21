/* 
 * Copyright (C) 1883 Thomas Edison - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the XYZ license, which unfortunately won't be
 * written for another century.
 *
 * You should have received a copy of the XYZ license with
 * this file. If not, please write to: , or visit :
 * 
 * Authors: Pedro Freitas, Nicole Vieira (201700124) and Yasmin Hage (202100778)
 *
 * Emails: 201700124@estudantes.ips.pt and 202100778@estudantes.ips.pt 
 */
 
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Create database
DROP DATABASE IF EXISTS `sii_project`;
CREATE DATABASE `sii_project`;

-- Create table for users
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

DROP DATABASE IF EXISTS `sii_project`;
CREATE DATABASE `sii_project`;
use `sii_project`;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  userId int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  userFullName varchar(255) NOT NULL,
  userName varchar(20) NOT NULL UNIQUE,
  userPassword varchar(50) NOT NULL,
  userAddress varchar(255) NOT NULL,
  userZipCode varchar(50) NOT NULL,
  userEmail varchar(100) NOT NULL UNIQUE,
  userGender varchar(1) NOT NULL,
  userPhone varchar(50) NOT NULL,
  userBirthDate datetime NOT NULL,
  userState varchar(1) NOT NULL,
  userType varchar(20) NOT NULL,
  userLatitude FLOAT( 10, 6 ), 
  userLongitude FLOAT( 10, 6 ) 
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

SET GLOBAL log_bin_trust_function_creators = 1;

-- Create function for the login validation
USE `sii_project`;
DROP function IF EXISTS `fun_login_validation`;

DELIMITER $$
USE `sii_project`$$
CREATE FUNCTION `fun_login_validation`(p_clientUsername VARCHAR(20)  
                , p_clientPassword VARCHAR(50) ) RETURNS INT(1)  
 BEGIN  
 DECLARE l_ret            INT(1) DEFAULT 0;  
     SET l_ret = IFNULL((SELECT DISTINCT 1  
                       FROM clients  
                      WHERE clientUsername = p_clientUsername  
                       AND clientPassword = MD5(p_clientPassword)),0);                           
 RETURN l_ret;  
 END$$
 

-- Insert default users
INSERT INTO `users` 
( `userName`, `userFullName`, `userPassword`, `userAddress`, `userZipCode`,  `userEmail`, `userGender`, `userPhone`, `userBirthDate`,`userState`,`userType`) VALUES
('Yasmin', 'yhage', md5('1234'), 'rua','8888','yashes20@yahoo.com.br','F','89898','1981-06-22 15:40:00','A','Admin');

INSERT INTO `users` 
( `userName`, `userFullName`, `userPassword`, `userAddress`, `userZipCode`,  `userEmail`, `userGender`, `userPhone`, `userBirthDate`,`userState`,`userType`) VALUES
('Nicole', 'nvieira', md5('1234'), 'rua','8888','nvieira@yahoo.com.br','F','89898','1999-06-22 15:40:00','A','Admin');


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- Create table for tasks Categories
USE `sii_project`;
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `categoryId` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `categoryName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

-- Insert categories 
INSERT INTO `sii_project`.`categories` (`categoryName`) VALUES ('Entregas');
INSERT INTO `sii_project`.`categories` (`categoryName`) VALUES ('Pet');

-- Create table for tasks
DROP TABLE IF EXISTS `tasks`;
CREATE TABLE `tasks` (
  `taskId` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `taskName` varchar(100) NOT NULL,
  `taskDescription` varchar(250) NOT NULL,
  `taskDateCreation` datetime NOT NULL,
  `taskStatus` varchar(20) NOT NULL,
  `taskDateStatus` datetime NOT NULL,
  `taskCategoryId` int(11) NOT NULL,
  `taskIsEnabled` tinyint NULL DEFAULT 1,
  `userCreation` int(11) NOT NULL,
  `userAssignment` int(11) ,
  `taskAddress` varchar(255) NOT NULL,
  `taskLatitude` FLOAT( 10, 6 ), 
  `taskLongitude` FLOAT( 10, 6 ),
  FOREIGN KEY taskCategoriesId(taskCategoryId) REFERENCES categories(categoryId),
  FOREIGN KEY taskUserId(userCreation) REFERENCES users(userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf16; 

-- Insert task
INSERT INTO `tasks` (`taskName`, `taskDescription`,
 `taskDateCreation`, `taskStatus`, `taskDateStatus`, `taskCategoryId`,`taskIsEnabled`,`userCreation`,
 `taskAddress`, `taskLatitude`,`taskLongitude` ) VALUES
('Levar o cão ao veterinário.', 'Por favor, necessito levar o cão ao veterinário, pois não posso faze-lo.',
'2022-05-21 15:40:00','New', '2022-05-21 15:40:00', 1, 1, 1, 
'Av. João Wallig, 1800 - Passo da Areia, Porto Alegre - RS','-30.027668', '-51.163269');

