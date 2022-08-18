-- MySQL dump 10.13  Distrib 8.0.25, for Win64 (x86_64)
--
-- Host: xerxes.cfhinzrtpqwd.us-east-2.rds.amazonaws.com    Database: BlogooDB
-- ------------------------------------------------------
-- Server version	8.0.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `CategoryCreationRequests`
--

DROP TABLE IF EXISTS `CategoryCreationRequests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CategoryCreationRequests` (
  `ccr_id` int NOT NULL AUTO_INCREMENT,
  `requester_user_id` varchar(64) NOT NULL,
  `parent_category_id` int NOT NULL,
  `category_name` varchar(64) NOT NULL,
  `category_desc` varchar(256) DEFAULT NULL,
  `request_details` varchar(256) NOT NULL,
  `approved` tinyint(1) DEFAULT NULL,
  `approval_date` datetime DEFAULT NULL,
  `approval_details` varchar(256) DEFAULT NULL,
  `request_date` datetime DEFAULT NULL,
  PRIMARY KEY (`ccr_id`),
  KEY `requester_user_id` (`requester_user_id`),
  KEY `parent_category_id` (`parent_category_id`),
  CONSTRAINT `CategoryCreationRequests_ibfk_1` FOREIGN KEY (`requester_user_id`) REFERENCES `Users` (`user_id`),
  CONSTRAINT `CategoryCreationRequests_ibfk_2` FOREIGN KEY (`parent_category_id`) REFERENCES `Categories` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CategoryCreationRequests`
--

LOCK TABLES `CategoryCreationRequests` WRITE;
/*!40000 ALTER TABLE `CategoryCreationRequests` DISABLE KEYS */;
INSERT INTO `CategoryCreationRequests` VALUES (4,'123456',1,'Technology','Technology discussions','No details + ratio + L + youre white ',NULL,NULL,NULL,'2022-01-16 07:18:36'),(5,'113985550905288138014',1,'AmericanPolitics','A political discussion','No ',NULL,NULL,NULL,'2022-01-16 07:29:30');
/*!40000 ALTER TABLE `CategoryCreationRequests` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`admin`@`%`*/ /*!50003 TRIGGER `create_category` AFTER UPDATE ON `CategoryCreationRequests` FOR EACH ROW BEGIN
	IF old.approved is null and new.approved = 1 THEN
		INSERT INTO Categories(parent_category_id, category_name, category_pfp_url, category_desc, date_created)
        VALUES(old.parent_category_id, 
				old.category_name, 
                'https://lh3.googleusercontent.com/a-/AOh14GjQ75MzIig737ug-yQInIeKnEcbUhkbHjY4vMj4-w=s96-c', 
                old.category_desc, 
                current_timestamp());
		INSERT INTO Moderators(user_id, category_id)
        values(old.requester_user_id, last_insert_id());
	END IF;
    
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-05-09 20:11:36
