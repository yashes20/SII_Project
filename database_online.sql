-- Create table for users
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

use `sql11507109`;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  userId int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  userFullName varchar(255) NOT NULL,
  userPassword varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  userAddress varchar(255) ,
  userZipCode varchar(50) ,
  userEmail varchar(100) NOT NULL UNIQUE,
  userGender varchar(1) NOT NULL,
  userPhone varchar(50) ,
  userBirthDate date ,
  userState varchar(1) NOT NULL,
  userType varchar(20) NOT NULL,
  userLatitude FLOAT( 10, 6 ), 
  userLongitude FLOAT( 10, 6 ),
  points int(11) DEFAULT 0,
  rating int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf16;


-- Insert default users
INSERT INTO `users` 
( `userFullName`, `userPassword`, `userAddress`, `userZipCode`,  `userEmail`, `userGender`, `userPhone`, `userBirthDate`,`userState`,`userType`) VALUES
('Yasmin', '$2a$10$MYRm/aUnz503FSklnhwnYOwPIk4EY0U52V08PKZr9ipS6.LhlmEDm', 'rua','8888','yashes20@yahoo.com.br','F','89898','1981-06-22','A','Admin');

INSERT INTO `users` 
( `userFullName`, `userPassword`, `userAddress`, `userZipCode`,  `userEmail`, `userGender`, `userPhone`, `userBirthDate`,`userState`,`userType`) VALUES
('Nicole Vieira',  '$2a$10$MYRm/aUnz503FSklnhwnYOwPIk4EY0U52V08PKZr9ipS6.LhlmEDm', 'rua','8888','nvieira@yahoo.com.br','F','89898','1999-06-22','A','Admin');

INSERT INTO `users` 
( `userFullName`, `userPassword`, `userAddress`, `userZipCode`,  `userEmail`, `userGender`, `userPhone`, `userBirthDate`,`userState`,`userType`) VALUES
('Nicole Fernandes',  '$2a$10$MYRm/aUnz503FSklnhwnYOwPIk4EY0U52V08PKZr9ipS6.LhlmEDm', 'rua','8888','nfernandes@gmail.com','F','89898','1995-09-22','A','Admin');

INSERT INTO `users` 
( `userFullName`, `userPassword`, `userAddress`, `userZipCode`,  `userEmail`, `userGender`, `userPhone`, `userBirthDate`,`userState`,`userType`) VALUES
('Michael Jackson',  '$2a$10$MYRm/aUnz503FSklnhwnYOwPIk4EY0U52V08PKZr9ipS6.LhlmEDm', 'rua','88889','mjack@gmail.com','F','89898','1999-06-22','A','Admin');


-- Create table for tasks Categories
USE `sql11507109`;
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `categoryId` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `categoryName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

-- Insert categories 
INSERT INTO `sql11507109`.`categories` (`categoryName`) VALUES ('Entregas');
INSERT INTO `sql11507109`.`categories` (`categoryName`) VALUES ('Pet');


-- Create table for task status
USE `sql11507109`;
DROP TABLE IF EXISTS `status`;
CREATE TABLE `status` (
  `statusId` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `statusName` varchar(20) NOT NULL,
  `statusType` varchar(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

-- Insert status
INSERT INTO `sql11507109`.`status` (`statusName`,`statusType`) VALUES ('New','S');
INSERT INTO `sql11507109`.`status` (`statusName`,`statusType`) VALUES ('Assignment','S');
INSERT INTO `sql11507109`.`status` (`statusName`,`statusType`) VALUES ('In Progress','U');
INSERT INTO `sql11507109`.`status` (`statusName`,`statusType`) VALUES ('Concluded','U');
INSERT INTO `sql11507109`.`status` (`statusName`,`statusType`) VALUES ('Give up','GU');

-- Create table for tasks
DROP TABLE IF EXISTS `tasks`;
CREATE TABLE `tasks` (
  `taskId` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `taskName` varchar(100) NOT NULL,
  `taskDescription` varchar(250) NOT NULL,
  `taskDateCreation` datetime NOT NULL,
  `taskStatusId` int(11) NOT NULL,
  `taskDateStatus` datetime NOT NULL,
  `taskCategoryId` int(11) NOT NULL,
  `taskIsEnabled` tinyint NULL DEFAULT 1,
  `userCreation` int(11) NOT NULL,
  `userAssignment` int(11) ,
  `taskDateAssignment` datetime,
  `taskAddress` varchar(255) NOT NULL,
  `taskLatitude` FLOAT( 10, 6 ), 
  `taskLongitude` FLOAT( 10, 6 ),
  `taskIsRated` tinyint NULL DEFAULT 0,
  FOREIGN KEY taskCategoriesId(taskCategoryId) REFERENCES categories(categoryId),
  FOREIGN KEY taskStatusId(taskStatusId) REFERENCES status(statusId),
  FOREIGN KEY taskUserId(userCreation) REFERENCES users(userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf16; 

-- Insert task
INSERT INTO `tasks` (`taskName`, `taskDescription`,
 `taskDateCreation`, `taskStatusId`, `taskDateStatus`, 
 `taskCategoryId`,`taskIsEnabled`,`userCreation`,`taskDateAssignment`,
 `taskAddress`, `taskLatitude`,`taskLongitude` ) VALUES
('Levar o cão ao veterinário.', 'Por favor, necessito levar o cão ao veterinário, pois não posso faze-lo.',
'2022-05-21 15:40:00',1, '2022-05-21 15:40:00',  
1, 1, 1, '2022-06-21 15:40:00',
'Av. João Wallig, 1800 - Passo da Areia, Porto Alegre - RS','-30.027668', '-51.163269');

-- Create table for requests
DROP TABLE IF EXISTS `requests`;
CREATE TABLE `requests`(
    `requestId` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `requestIdVoluntary` int(11) NOT NULL,
    `requestIdTask` int(11) NOT NULL,
    `requestStatus` bit,
    FOREIGN KEY requestIdVoluntary(requestIdVoluntary) REFERENCES users(userId),
    FOREIGN KEY requestIdTask(requestIdTask) REFERENCES tasks(taskId)
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

-- Create table for ratings
DROP TABLE IF EXISTS `ratings`;
CREATE TABLE `ratings`(
    `ratingId` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `ratingIdUser` int(11) NOT NULL,
    `ratingIdAssUser` int(11) NOT NULL,
    `rating` int(11) NOT NULL,
    FOREIGN KEY ratingIdUser(ratingIdUser) REFERENCES users(userId),
    FOREIGN KEY ratingIdAssUser(ratingIdAssUser) REFERENCES users(userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

/* DROP TRIGGER IF EXISTS updateUserRating;
CREATE TRIGGER updateUserRating AFTER INSERT
ON ratings
FOR EACH ROW
UPDATE users SET rating = (SELECT  IFNULL(round(sum(rating) / count(1)),0) FROM ratings WHERE ratings.ratingIdUser = NEW.ratingIdUser)
WHERE userId = NEW.ratingIdUser;
DELIMITER ; */

DROP PROCEDURE IF EXISTS updateUserPoints;
DELIMITER $$

Create procedure updateUserPoints (in id int) 
begin
Declare userPoints INT;
select points into userPoints from users where userId = id LIMIT 1;
SET userPoints = userPoints + 10;
select id;
Update users set points = userPoints where userId = id;

END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS updateRequestAssigment;
DELIMITER $$
Create procedure updateRequestAssigment (in id int) 
begin
	Declare idTask INT;
	Declare userAssignment INT;
    select requestIdTask, requestIdVoluntary into idTask, userAssignment from requests where requestId = id LIMIT 1;
    Update tasks set userAssignment = userAssignment,  taskStatusId = 2 where taskId = idTask;
    select id, idTask;
    UPDATE requests SET requestStatus = 1 WHERE requestId = id;
    UPDATE requests SET requestStatus = 0 WHERE requestId != id and requestIdTask = idTask;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS insertRatingUpdateTask;
DELIMITER $$
Create procedure insertRatingUpdateTask (in idUser int, in idAssUser int, in rating int, in idTask int) 
begin
	INSERT INTO ratings (ratingIdUser, ratingIdAssUser, rating) VALUES (idUser,idAssUser,rating);
    UPDATE tasks set taskIsRated = 1 WHERE taskId = idTask;
    UPDATE users SET rating = (SELECT  IFNULL(round(sum(rating) / count(1)),0) FROM ratings WHERE ratings.ratingIdUser = idUser)
    WHERE userId = idUser;
END$$
DELIMITER ;