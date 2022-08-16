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
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `user_id` varchar(64) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `email_address` varchar(255) NOT NULL,
  `pfp_url` mediumtext NOT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `location` varchar(45) DEFAULT NULL,
  `date_created` datetime NOT NULL,
  `date_last_login` datetime NOT NULL,
  `instagram_url` varchar(1000) DEFAULT NULL,
  `facebook_url` varchar(1000) DEFAULT NULL,
  `youtube_url` varchar(1000) DEFAULT NULL,
  `twitter_url` varchar(1000) DEFAULT NULL,
  `website_url` varchar(45) DEFAULT NULL,
  `is_deleted` enum('true','false') NOT NULL DEFAULT 'false',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email_address_UNIQUE` (`email_address`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES ('113985550905288138014','ammaaraziz360','Ammaar','Mohammed','ammaaraziz360@gmail.com','https://lh3.googleusercontent.com/a-/AOh14GjQ75MzIig737ug-yQInIeKnEcbUhkbHjY4vMj4-w=s96-c','HI everyone, welcome to Blogoo!',NULL,'2021-12-20 00:00:00','2022-01-16 00:00:00','https://www.instagram.com/axaam_studios/',NULL,NULL,'https://twitter.com/M3nac1ngRadical',NULL,'false'),('123456','test_user','test','user','test_user@gmail.com','https://lh3.googleusercontent.com/a-/AOh14GjQ75MzIig737ug-yQInIeKnEcbUhkbHjY4vMj4-w=s96-c',NULL,NULL,'2021-12-25 00:00:00','2021-12-25 00:00:00',NULL,NULL,NULL,NULL,NULL,'false');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
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

-- Dump completed on 2022-05-09 20:11:25
