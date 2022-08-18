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
-- Table structure for table `AdminReports`
--

DROP TABLE IF EXISTS `AdminReports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AdminReports` (
  `report_id` int NOT NULL AUTO_INCREMENT,
  `reporter_user_id` varchar(64) NOT NULL,
  `post_id` int DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `reason_id` int NOT NULL,
  `report_details` varchar(1024) DEFAULT NULL,
  `report_date` date NOT NULL,
  `action_date` date DEFAULT NULL,
  PRIMARY KEY (`report_id`),
  KEY `reporter_user_id` (`reporter_user_id`),
  KEY `post_id` (`post_id`),
  KEY `category_id` (`category_id`),
  KEY `reason_id` (`reason_id`),
  CONSTRAINT `AdminReports_ibfk_1` FOREIGN KEY (`reporter_user_id`) REFERENCES `Users` (`user_id`),
  CONSTRAINT `AdminReports_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `Posts` (`post_id`),
  CONSTRAINT `AdminReports_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `Categories` (`category_id`),
  CONSTRAINT `AdminReports_ibfk_4` FOREIGN KEY (`reason_id`) REFERENCES `Reasons` (`reason_id`),
  CONSTRAINT `admin_chk_null` CHECK ((((`post_id` is not null) and (`category_id` is null)) or ((`post_id` is null) and (`category_id` is not null))))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AdminReports`
--

LOCK TABLES `AdminReports` WRITE;
/*!40000 ALTER TABLE `AdminReports` DISABLE KEYS */;
/*!40000 ALTER TABLE `AdminReports` ENABLE KEYS */;
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

-- Dump completed on 2022-05-09 20:11:57
