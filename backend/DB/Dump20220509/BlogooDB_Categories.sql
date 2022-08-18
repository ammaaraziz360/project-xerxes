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
-- Table structure for table `Categories`
--

DROP TABLE IF EXISTS `Categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `parent_category_id` int DEFAULT NULL,
  `category_name` varchar(255) NOT NULL,
  `category_pfp_url` mediumtext NOT NULL,
  `category_desc` varchar(1024) DEFAULT NULL,
  `date_created` date NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `category_name` (`category_name`),
  KEY `parent_category_id` (`parent_category_id`),
  CONSTRAINT `Categories_ibfk_1` FOREIGN KEY (`parent_category_id`) REFERENCES `Categories` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Categories`
--

LOCK TABLES `Categories` WRITE;
/*!40000 ALTER TABLE `Categories` DISABLE KEYS */;
INSERT INTO `Categories` VALUES (1,NULL,'Blogoo','https://avatarfiles.alphacoders.com/667/thumb-66748.jpg','First category','0000-00-00'),(2,1,'level 2 Category 1','https://avatarfiles.alphacoders.com/792/thumb-79295.jpg','level 2 Category 1','0001-02-22'),(3,1,'level 2 Category 2','https://avatarfiles.alphacoders.com/792/thumb-79295.jpg','level 2 Category 2','0001-02-22'),(4,1,'level 2 Category 3','https://avatarfiles.alphacoders.com/792/thumb-79295.jpg','level 2 Category 3','0001-02-22'),(5,1,'level 2 Category 4','https://avatarfiles.alphacoders.com/792/thumb-79295.jpg','level 2 Category 4','0001-02-22'),(6,1,'level 2 Category 5','https://avatarfiles.alphacoders.com/792/thumb-79295.jpg','level 2 Category 5','0001-02-22'),(7,2,'level 3 Category 1','https://static.wikia.nocookie.net/township/images/6/6e/Profile_Pic_118.png/revision/latest/smart/width/250/height/250?cb=20200617061139','level 3 Category 1','0001-02-22'),(8,3,'level 3 Category 2','https://static.wikia.nocookie.net/township/images/6/6e/Profile_Pic_118.png/revision/latest/smart/width/250/height/250?cb=20200617061139','level 3 Category 2','0001-02-22'),(9,4,'level 3 Category 3','https://static.wikia.nocookie.net/township/images/6/6e/Profile_Pic_118.png/revision/latest/smart/width/250/height/250?cb=20200617061139','level 3 Category 3','0001-02-22'),(10,5,'level 3 Category 4','https://static.wikia.nocookie.net/township/images/6/6e/Profile_Pic_118.png/revision/latest/smart/width/250/height/250?cb=20200617061139','level 3 Category 4','0001-02-22'),(11,5,'level 3 Category 5','https://static.wikia.nocookie.net/township/images/6/6e/Profile_Pic_118.png/revision/latest/smart/width/250/height/250?cb=20200617061139','level 3 Category 5','0001-02-22'),(12,1,'Politics','https://lh3.googleusercontent.com/a-/AOh14GjQ75MzIig737ug-yQInIeKnEcbUhkbHjY4vMj4-w=s96-c','A place to discuss politics','2022-01-14');
/*!40000 ALTER TABLE `Categories` ENABLE KEYS */;
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

-- Dump completed on 2022-05-09 20:11:41
