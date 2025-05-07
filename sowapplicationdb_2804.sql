-- MySQL dump 10.13  Distrib 8.0.26, for Win64 (x86_64)
--
-- Host: localhost    Database: sowapplicationdb
-- ------------------------------------------------------
-- Server version	8.0.26

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

--
-- Table structure for table `addendum`
--

DROP TABLE IF EXISTS `addendum`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addendum` (
  `addendum_id` int NOT NULL AUTO_INCREMENT,
  `sow_id` int NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `uploaded_by` varchar(50) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `delivery_unit` varchar(50) DEFAULT NULL,
  `stakeholders` varchar(500) DEFAULT NULL,
  `delivery_manager` varchar(50) DEFAULT NULL,
  `upload_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`addendum_id`),
  KEY `sow_id` (`sow_id`),
  CONSTRAINT `addendum_ibfk_1` FOREIGN KEY (`sow_id`) REFERENCES `sow` (`sow_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addendum`
--

LOCK TABLES `addendum` WRITE;
/*!40000 ALTER TABLE `addendum` DISABLE KEYS */;
INSERT INTO `addendum` VALUES (2,45,'Shareable_Employ-Harbinger Fixed Price SOW for Workato implementation.pdf','1','2025-04-01','2025-09-30','Delivery Unit 2','Stakeholder ','John Doe	','2025-04-22 14:59:29'),(3,45,'Shareable_Employ-Harbinger Fixed Price SOW for Workato implementation.pdf','1','2025-04-01','2025-09-30','Delivery Unit 2','Stakeholder ','John Doe	','2025-04-22 15:00:01'),(8,50,'Shareable_Employ-Harbinger Fixed Price SOW for Workato implementation.pdf','1','2025-04-01','2025-09-30','DU-3','shruti@example.com','Shruti Rawat','2025-04-23 12:34:26'),(11,67,'Shareable_Employ-Harbinger Fixed Price SOW for Workato implementation.pdf','1','2025-04-01','2025-09-30','DU-1',NULL,'Tanuja Toke','2025-04-25 20:10:38');
/*!40000 ALTER TABLE `addendum` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `sow_id` int NOT NULL,
  `notification_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `message` text NOT NULL,
  `status` enum('Sent','Pending','Failed') DEFAULT 'Pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `sow_id` (`sow_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`sow_id`) REFERENCES `sow` (`sow_id`)
) ENGINE=InnoDB AUTO_INCREMENT=142 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (102,49,'2025-04-16 18:30:00','1 month before the end date.','Sent','2025-04-17 14:10:06'),(103,49,'2025-04-16 18:30:00','3 days after the first reminder.','Sent','2025-04-17 14:10:06'),(104,49,'2025-04-20 18:30:00','5 days after the second reminder.','Sent','2025-04-17 14:10:06'),(105,49,'2025-09-13 18:30:00','1 week after the third reminder.','Pending','2025-04-17 14:10:06'),(106,49,'2025-09-20 18:30:00','2 weeks after the third reminder.','Pending','2025-04-17 14:10:06'),(107,50,'2025-04-17 18:30:00','1 month before the end date.','Sent','2025-04-18 04:53:21'),(108,50,'2025-09-01 18:30:00','3 days after the first reminder.','Pending','2025-04-18 04:53:21'),(109,50,'2025-09-06 18:30:00','5 days after the second reminder.','Pending','2025-04-18 04:53:21'),(110,50,'2025-09-13 18:30:00','1 week after the third reminder.','Pending','2025-04-18 04:53:21'),(137,67,'2025-08-29 18:30:00','1 month before the end date.','Pending','2025-04-25 14:39:13'),(138,67,'2025-09-01 18:30:00','3 days after the first reminder.','Pending','2025-04-25 14:39:13'),(139,67,'2025-09-06 18:30:00','5 days after the second reminder.','Pending','2025-04-25 14:39:13'),(140,67,'2025-09-13 18:30:00','1 week after the third reminder.','Pending','2025-04-25 14:39:13'),(141,67,'2025-04-24 18:30:00','2 weeks after the third reminder.','Sent','2025-04-25 14:39:13');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `passwordresettokens`
--

DROP TABLE IF EXISTS `passwordresettokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `passwordresettokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `passwordresettokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `passwordresettokens`
--

LOCK TABLES `passwordresettokens` WRITE;
/*!40000 ALTER TABLE `passwordresettokens` DISABLE KEYS */;
INSERT INTO `passwordresettokens` VALUES (18,46,'8ad8b158be8731d8f1e2bf7487d0e15a16a55b0bfa6fb1b9aff7200e1a8c4cf4','2025-04-09 11:46:05'),(19,50,'44b7d8f11d637ab976e05213ca8343908f646f3b8cdc8a72277599ad22091207','2025-04-09 11:50:58'),(20,51,'f429631f6c4d4027593758b01a6094d71dd4ce52a38fdf4848e4b48a2803252d','2025-04-10 11:13:04'),(21,52,'badeb0d72f30bcebe20da718e7c26ec50458611566660438b96159c0bc447acc','2025-04-10 11:17:51'),(22,53,'e807ed0166cb048dfa1aa8a766b9ac30b6a05a21f98ec3e4a6875df5dad0e7ea','2025-04-15 14:57:18');
/*!40000 ALTER TABLE `passwordresettokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sow`
--

DROP TABLE IF EXISTS `sow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sow` (
  `sow_id` int NOT NULL AUTO_INCREMENT,
  `project_name` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `stakeholders` varchar(500) NOT NULL,
  `end_date` date NOT NULL,
  `delivery_manager` varchar(50) NOT NULL,
  `status` tinyint NOT NULL COMMENT '0=Inactive, 1=Active, 2=About-End',
  `delivery_unit` varchar(50) NOT NULL,
  `uploaded_by` varchar(50) NOT NULL,
  `upload_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `file_name` varchar(255) NOT NULL,
  `status_detail` enum('active','inactive','about-end') DEFAULT 'active',
  PRIMARY KEY (`sow_id`),
  KEY `uploaded_by` (`uploaded_by`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sow`
--

LOCK TABLES `sow` WRITE;
/*!40000 ALTER TABLE `sow` DISABLE KEYS */;
INSERT INTO `sow` VALUES (45,'Imagine-Bc','2025-04-01','	john,doe,jane','2025-05-11','Tanuja Toke',1,'DU-1','1','2025-04-09 15:31:29','Shareable_Employ-Harbinger Fixed Price SOW for Workato implementation.pdf','active'),(46,'HEX','2025-04-01','swa@example.com','2025-09-30','Tanuja Toke',1,'DU-1','1','2025-04-09 15:39:33','Shareable_Employ-Harbinger Fixed Price SOW for Workato implementation.pdf','active'),(49,'Ethico','2025-04-01','shruti.rawar@harbingergroup.com,swaroop.bidkar@harbingergroup.com','2025-05-11','Tanuja Toke',2,'DU-1','1','2025-04-17 19:40:06','Shareable_Employ-Harbinger Fixed Price SOW for Workato implementation.pdf','active'),(50,'Project Home','2025-04-01','swaroop.bidkar@harbingergroup.com,tanuja.toke@harbingergroup.com','2025-09-30','Dhara Masani',1,'DU-2','1','2025-04-18 10:23:21','Shareable_Employ-Harbinger Fixed Price SOW for Workato implementation.pdf','active'),(61,'Skillsoft','2025-03-15','	john,doe,jane','2025-09-30','Dhara Masani',0,'DU-2','1','2025-04-18 17:05:10','Shareable_Employ-Harbinger Fixed Price SOW for Workato implementation.pdf','active'),(67,'SOW','2025-04-01','tanuja.toke@harbingergroup.com,Bharti@harbingergroup.com,shwetap@harbingergroup.com','2025-09-30','Tanuja Toke',1,'DU-1','1','2025-04-25 20:09:13','Shareable_Employ-Harbinger Fixed Price SOW for Workato implementation.pdf','about-end');
/*!40000 ALTER TABLE `sow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `First_name` varchar(255) NOT NULL,
  `Last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(50) NOT NULL,
  `delivery_unit` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `isactive` int DEFAULT '0',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (44,'John','Doe','john@example.com','$2b$10$lsg8LTNP.ZBQx2ClFUWgYe9lluDJQRDBIQT8HLtNth18B/PI2HvHW','Admin','DU1','2025-04-08 05:06:43',1),(46,'John','Doe','john1@example.com',NULL,'Admin','Ad','2025-04-08 06:16:05',0),(50,'Umesh ','Kanade','john12@example.com','$2b$10$HqZi9j9stkqaKWmoUcwSGe2YTe9O.HEAKqaWMd/khr6ffMk5vG.Yq','Delivery Head','DU-5','2025-04-08 06:20:58',0),(51,'Bharati ','Satpute','swa@example.com','$2b$10$HqZi9j9stkqaKWmoUcwSGe2YTe9O.HEAKqaWMd/khr6ffMk5vG.Yq','Delivery Head','DU-1','2025-04-09 05:43:04',0),(52,'Parag','Deshpande','shruti@example.com',NULL,'Delivery Head','DU-2','2025-04-09 05:47:51',0),(53,'Bharti','Satpute','s@gmail.com',NULL,'Delivery Head','DU-4','2025-04-14 09:27:18',0),(54,'Tanuja','Toke','swaroop@harbingergroup.com','$2b$10$.TIKJrr2AVqBVFM/En2rPOU7o2Mp1GQXpeNYlcsIw.ZiDv6L7Ncgu','Delivery Manager','DU-4','2025-04-14 09:31:50',0),(55,'Dhara ','Masani','bharati@harbingergroup.com','$2b$10$0sVtOiwGuqGyP3j7jUa4pODepNlNIh2t7YyAtTXY9a.9.Z/mHVoqy','Delivery Manager','Delivery Unit 5','2025-04-18 08:12:43',0),(56,'Tanuja ','Toke','tanjua@harbingergroup.com','$2b$10$0sVtOiwGuqGyP3j7jUa4pODepNlNIh2t7YyAtTXY9a.9.Z/mHVoqy','Delivery Head','DU-3','2025-04-18 08:12:43',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-28 17:47:18
