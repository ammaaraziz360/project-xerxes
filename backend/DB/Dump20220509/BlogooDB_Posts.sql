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
-- Table structure for table `Posts`
--

DROP TABLE IF EXISTS `Posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Posts` (
  `post_id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(64) NOT NULL,
  `title` varchar(64) DEFAULT NULL,
  `body` mediumtext NOT NULL,
  `date_posted` datetime NOT NULL,
  `is_deleted` enum('true','false') NOT NULL DEFAULT 'false',
  `reply_post_id` int DEFAULT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`post_id`),
  KEY `user_id` (`user_id`),
  KEY `reply_post_id` (`reply_post_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `Posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`),
  CONSTRAINT `Posts_ibfk_2` FOREIGN KEY (`reply_post_id`) REFERENCES `Posts` (`post_id`),
  CONSTRAINT `Posts_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `Categories` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Posts`
--

LOCK TABLES `Posts` WRITE;
/*!40000 ALTER TABLE `Posts` DISABLE KEYS */;
INSERT INTO `Posts` VALUES (1,'113985550905288138014','titlle','post','0000-00-00 00:00:00','false',NULL,1),(2,'113985550905288138014',NULL,'comment','2021-01-01 00:00:00','false',1,1),(3,'113985550905288138014',NULL,'comment','2021-01-01 00:00:00','false',2,1),(5,'123456','help','help me','2021-12-28 00:00:00','false',1,1),(6,'123456','Hello','I do not know what to talk about','2021-12-29 07:23:34','false',NULL,1),(7,'113985550905288138014',NULL,'Nice post bro, keep it up!!','2021-12-30 07:57:24','false',1,1),(8,'113985550905288138014',NULL,'Are you serious?? this is utterly trash','2021-12-30 07:59:34','false',7,1),(9,'113985550905288138014',NULL,'What do you need help with?','2021-12-30 08:00:36','false',5,1),(10,'113985550905288138014',NULL,'what?','2021-12-30 22:46:15','false',3,1),(11,'113985550905288138014',NULL,'wym?','2021-12-30 22:46:58','false',10,1),(12,'113985550905288138014','Hi','Hello everyone','2022-01-08 08:38:18','false',NULL,1),(13,'113985550905288138014',NULL,'Hello','2022-01-08 08:46:21','false',12,1),(14,'113985550905288138014',NULL,'So what lol?','2022-01-10 07:41:31','false',6,1);
/*!40000 ALTER TABLE `Posts` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-05-09 20:11:45
