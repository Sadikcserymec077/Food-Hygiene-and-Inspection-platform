-- MySQL dump 10.13  Distrib 8.0.39, for Win64 (x86_64)
--
-- Host: localhost    Database: fssai
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `zone` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'Meera Joshi','admin@gmail.com','9876543210','pass123','Banglore South','2025-06-11 20:47:36'),(2,'Ravi Kumar','admin2@gmail.com','9123456789','pass123','Banglore Central','2025-06-11 20:47:36'),(3,'Sneha Shah','admin3@gmail.com','9012345679','pass123','Chennai North','2025-06-11 20:47:36');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `complaints`
--

DROP TABLE IF EXISTS `complaints`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `complaints` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) NOT NULL,
  `restaurant_id` int NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `resolution_taken` text,
  `is_anonymous` tinyint(1) DEFAULT '0',
  `status` enum('pending','in-progress','resolved','rejected') DEFAULT 'pending',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `images` text,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `restaurant_id` (`restaurant_id`),
  CONSTRAINT `complaints_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`email`) ON DELETE CASCADE,
  CONSTRAINT `complaints_ibfk_2` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complaints`
--

LOCK TABLES `complaints` WRITE;
/*!40000 ALTER TABLE `complaints` DISABLE KEYS */;
INSERT INTO `complaints` VALUES (1,'user1@gmail.com',8,'shjd','hsabj',NULL,0,'pending','2025-07-06 14:10:29',NULL,NULL),(2,'user1@gmail.com',10,'dhdakd','lkdsf md',NULL,0,'pending','2025-07-06 14:20:16',NULL,NULL),(3,'user1@gmail.com',2,'daf','sabhdas',NULL,1,'pending','2025-07-06 14:32:34',NULL,NULL),(4,'user1@gmail.com',2,'yahoo','sds',NULL,0,'pending','2025-07-06 15:26:04',NULL,NULL),(5,'user1@gmail.com',5,'yahoo','sasa',NULL,1,'resolved','2025-07-06 15:31:31','2025-07-08 00:42:13',NULL),(6,'user1@gmail.com',4,'sajhd','hjd',NULL,1,'pending','2025-07-07 20:51:50',NULL,'[\"1751901710868-apple.jpeg\"]'),(7,'user@gmail.com',2,'adjk','sda k',NULL,0,'pending','2025-07-08 01:24:02',NULL,'[\"1751918042153-banana.jpeg\"]'),(8,'user1@gmail.com',8,'sdf k','sfkgm','njlvsjnksd',0,'resolved','2025-07-08 01:25:22','2025-07-08 01:25:47','[\"1751918122651-banana.jpeg\"]'),(9,'user1@gmail.com',8,'Unhygienic kitchen practices','During my visit to Chennai Flavours on June 30, 2025, at around 8:15 PM, I noticed that the kitchen staff were not wearing gloves or hairnets while handling food. The cooking area appeared unclean, with leftover food on the floor and uncovered ingredients lying out in the open. This raises serious concerns about the hygiene and safety standards being followed at the restaurant.',NULL,1,'pending','2025-07-08 09:15:55',NULL,'[\"1751946355600-download.jpg\"]'),(10,'user1@gmail.com',2,'hkfbeedhuke','edjv',NULL,0,'pending','2025-07-28 10:21:17',NULL,'[\"1753678277875-Gemini_Generated_Image_yety5xyety5xyety.png\"]'),(11,'user1@gmail.com',8,'Unhygienic kitchen practices','visited the restaurant on July 25th and found the kitchen very dirty. Flies were hovering near the food, and the staff wasn’t wearing gloves or hairnets. Food was served cold and stale.',NULL,1,'pending','2025-07-28 11:32:37',NULL,'[\"1753682557495-download.jpg\"]');
/*!40000 ALTER TABLE `complaints` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `user_id` varchar(255) NOT NULL,
  `restaurant_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`restaurant_id`),
  KEY `restaurant_id` (`restaurant_id`),
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`email`),
  CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` VALUES ('user1@gmail.com',2),('user1@gmail.com',4),('user1@gmail.com',5);
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inspection_reports`
--

DROP TABLE IF EXISTS `inspection_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inspection_reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `inspection_id` int DEFAULT NULL,
  `inspector_id` int DEFAULT NULL,
  `restaurant_id` int DEFAULT NULL,
  `report_json` json DEFAULT NULL,
  `submitted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `notes` text,
  `image_paths` json DEFAULT NULL,
  `latitude` decimal(9,6) DEFAULT NULL,
  `longitude` decimal(9,6) DEFAULT NULL,
  `hygiene_score` decimal(2,1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `inspection_id` (`inspection_id`),
  KEY `inspector_id` (`inspector_id`),
  KEY `restaurant_id` (`restaurant_id`),
  CONSTRAINT `inspection_reports_ibfk_1` FOREIGN KEY (`inspection_id`) REFERENCES `inspections` (`id`),
  CONSTRAINT `inspection_reports_ibfk_2` FOREIGN KEY (`inspector_id`) REFERENCES `inspectors` (`id`),
  CONSTRAINT `inspection_reports_ibfk_3` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`),
  CONSTRAINT `inspection_reports_chk_1` CHECK ((`hygiene_score` between 1.0 and 5.0))
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inspection_reports`
--

LOCK TABLES `inspection_reports` WRITE;
/*!40000 ALTER TABLE `inspection_reports` DISABLE KEYS */;
INSERT INTO `inspection_reports` VALUES (1,1,1,1,'{\"waste\": {\"waste-5\": true}, \"hygiene\": {\"hygiene-3\": true}, \"premises\": {\"premises-1\": true}, \"equipment\": {\"equipment-5\": true}, \"foodStorage\": {\"storage-2\": true}}','2025-06-13 20:47:54','pending',NULL,NULL,NULL,NULL,NULL),(2,3,1,3,'{\"waste\": {\"waste-1\": true, \"waste-4\": true}, \"hygiene\": {\"hygiene-3\": true, \"hygiene-4\": true}, \"premises\": {\"premises-2\": true, \"premises-3\": true, \"premises-5\": true}, \"equipment\": {\"equipment-3\": true, \"equipment-4\": true}, \"inspectionNotes\": {\"0\": true, \"1\": true, \"2\": true, \"3\": true, \"4\": true, \"5\": true, \"6\": true, \"7\": true, \"8\": true, \"9\": true, \"10\": true, \"11\": true, \"12\": true, \"13\": true, \"14\": true, \"15\": true, \"16\": true, \"17\": true, \"18\": true, \"19\": true, \"20\": true, \"21\": true}}','2025-06-13 21:04:19','pending','',NULL,NULL,NULL,NULL),(3,8,1,5,'{\"waste\": {\"waste-5\": true}, \"hygiene\": {\"hygiene-1\": true, \"hygiene-5\": true}, \"premises\": {\"premises-4\": true, \"premises-5\": true}, \"equipment\": {\"equipment-5\": true}, \"foodStorage\": {\"storage-5\": true}}','2025-06-13 21:07:02','pending','sdilhfd m,gd;ogsdko;gsd',NULL,NULL,NULL,NULL),(4,1,NULL,1,'{\"waste\": {\"waste-4\": true}, \"hygiene\": {\"hygiene-3\": true, \"hygiene-5\": true}, \"premises\": {\"premises-2\": true}, \"equipment\": {\"equipment-4\": true}, \"foodStorage\": {\"storage-3\": true}}','2025-06-13 21:08:41','pending','fxffcvbbcgvy',NULL,NULL,NULL,NULL),(5,13,1,10,'{\"hygiene\": {\"hygiene-3\": true}}','2025-06-13 21:10:45','approved','asf',NULL,NULL,NULL,NULL),(6,5,1,5,'{\"foodStorage\": {\"storage-1\": true}}','2025-06-13 21:17:01','pending','dsgdds',NULL,NULL,NULL,NULL),(7,6,1,5,'{}','2025-06-13 21:18:05','approved','sad',NULL,NULL,NULL,NULL),(8,6,1,5,'{}','2025-06-13 21:18:38','pending','sad',NULL,NULL,NULL,NULL),(9,7,1,5,'{\"waste\": {\"waste-2\": true}, \"hygiene\": {\"hygiene-1\": true}, \"premises\": {\"premises-2\": true}, \"equipment\": {\"equipment-3\": true}, \"foodStorage\": {\"storage-1\": true}}','2025-06-14 03:48:51','approved','dbhd',NULL,NULL,NULL,NULL),(10,10,1,7,'{\"equipment\": {\"cleanUtensils\": \"on\", \"workingRefrigeration\": \"on\"}, \"foodStorage\": {\"separateRawCooked\": \"on\", \"temperatureControlled\": \"on\"}, \"personalHygiene\": {\"handsClean\": \"on\"}, \"wasteManagement\": {\"coveredBins\": \"on\", \"regularCollection\": \"on\"}, \"premisesCleanliness\": {\"ceilingsClean\": \"on\"}}','2025-07-05 06:35:36','approved','sdfdg','[\"1751697336064-injured dog.jpg\"]',NULL,NULL,NULL),(11,9,1,7,'{\"equipment\": {\"properSanitization\": \"on\", \"workingRefrigeration\": \"on\"}, \"foodStorage\": {\"properLabeling\": \"on\", \"separateRawCooked\": \"on\"}, \"personalHygiene\": {\"hairCovered\": \"on\"}, \"wasteManagement\": {\"coveredBins\": \"on\", \"pestControl\": \"on\"}, \"premisesCleanliness\": {\"floorsClean\": \"on\", \"ceilingsClean\": \"on\"}}','2025-07-06 13:02:18','approved','esfsd','[\"1751806938822-937b6a79-b1f0-4376-8c19-757ed058fae6.jpg\"]',12.982682,77.601178,2.3);
/*!40000 ALTER TABLE `inspection_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inspections`
--

DROP TABLE IF EXISTS `inspections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inspections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `restaurant_id` int NOT NULL,
  `inspector_id` int NOT NULL,
  `status` enum('Scheduled','Not-Scheduled','Completed') NOT NULL,
  `last_inspection` date DEFAULT NULL,
  `inspection_date` date DEFAULT (curdate()),
  PRIMARY KEY (`id`),
  KEY `restaurant_id` (`restaurant_id`),
  KEY `inspector_id` (`inspector_id`),
  CONSTRAINT `inspections_ibfk_1` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`),
  CONSTRAINT `inspections_ibfk_2` FOREIGN KEY (`inspector_id`) REFERENCES `inspectors` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inspections`
--

LOCK TABLES `inspections` WRITE;
/*!40000 ALTER TABLE `inspections` DISABLE KEYS */;
INSERT INTO `inspections` VALUES (1,1,1,'Completed','2025-06-10','2025-06-14'),(2,2,1,'Not-Scheduled','2025-06-05','2025-06-14'),(3,3,1,'Completed','2025-05-30','2025-06-14'),(4,4,1,'Not-Scheduled','2025-05-20','2025-06-14'),(5,5,1,'Completed','2025-06-11','2025-06-14'),(6,5,1,'Completed','2025-05-11','2025-06-14'),(7,5,1,'Completed','2025-05-11','2025-06-14'),(8,5,1,'Completed','2025-05-11','2025-06-14'),(9,7,1,'Completed','2025-07-06','2025-06-14'),(10,7,1,'Completed','2025-07-05','2025-06-14'),(11,5,1,'Scheduled','2025-05-11','2025-06-14'),(12,8,1,'Scheduled','2025-05-11','2025-06-14'),(13,10,1,'Completed','2025-05-11','2025-06-14'),(14,9,1,'Scheduled','2025-05-11','2025-06-14'),(16,12,1,'Scheduled',NULL,'2025-07-08');
/*!40000 ALTER TABLE `inspections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inspectors`
--

DROP TABLE IF EXISTS `inspectors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inspectors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `zone` varchar(100) DEFAULT NULL,
  `region` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inspectors`
--

LOCK TABLES `inspectors` WRITE;
/*!40000 ALTER TABLE `inspectors` DISABLE KEYS */;
INSERT INTO `inspectors` VALUES (1,'Karthik Rao','insp@gmail.com','78901234562','pass123','Banglore South','Kengeri','2025-06-11 20:47:36'),(2,'Anjali Menon','insp2@gmail.com','7890654321','pass123','Banglore South','Pattanagere','2025-06-11 20:47:36'),(4,'Neha Verma','insp4@gmail.com','9090909090','pass123','Banglore Central','Indiranagar','2025-06-11 20:47:36'),(5,'Sameer Patil','insp5@gmail.com','8787878787','pass123','Banglore Central','Koramangala','2025-06-11 20:47:36'),(6,'Pooja Reddy','insp6@gmail.com','8980077000','pass123','Chennai North','Red Hills','2025-06-11 20:47:36'),(7,'Aman Bhatt','insp7@gmail.com','8567452301','pass123','Chennai North','Minjur','2025-06-11 20:47:36');
/*!40000 ALTER TABLE `inspectors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `restaurants`
--

DROP TABLE IF EXISTS `restaurants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `license_number` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `zone` varchar(100) DEFAULT NULL,
  `region` varchar(100) DEFAULT NULL,
  `address` text,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_inspection_date` date DEFAULT NULL,
  `hygiene_score` decimal(3,1) DEFAULT NULL,
  `insp_rep_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `chk_hygiene_score` CHECK ((`hygiene_score` between 1.0 and 5.0))
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurants`
--

LOCK TABLES `restaurants` WRITE;
/*!40000 ALTER TABLE `restaurants` DISABLE KEYS */;
INSERT INTO `restaurants` VALUES (1,'Spice Hub',NULL,'LIC12345','spicehub@gmail.com','9876543210','Bangalore South','Kengeri','12, Kengeri Main Rd','pending',1,'2025-06-12 11:17:00','2025-05-11',4.2,NULL),(2,'Green Leaf',NULL,'LIC67890','greenleaf@gmail.com','9123456789','Bangalore South','Pattanagere','78, JP Nagar','approved',1,'2025-06-12 11:17:00','2025-05-11',2.2,NULL),(3,'Tandoori Treat',NULL,'LIC11122','treat@gmail.com','9988776655','Bangalore Central','Indiranagar','45, CMH Road','pending',1,'2025-06-12 11:17:00','2025-05-11',4.2,NULL),(4,'Chennai Flavours',NULL,'LIC33344','cf@gmail.com','9080706050','Chennai North','Red Hills','56, Red Hills Rd','approved',1,'2025-06-12 11:17:00','2025-05-11',1.2,NULL),(5,'Spice Hub11',NULL,'LIC12346','spicehub@gmail.com','9876543210','Banglore South','Kengeri','12, Kengeri Main Rd','approved',1,'2025-06-12 11:29:13','2025-05-11',NULL,9),(7,'Spice Hub111',NULL,'LIC12346','spicehub@gmail.com','9876543210','Banglore South','Kengeri','12, Kengeri Main Rd','approved',1,'2025-06-12 11:30:54','2025-07-05',NULL,10),(8,'Spice Hub112',NULL,'LIC12346','spicehub@gmail.com','9876543210','Banglore South','Kengeri','12, Kengeri Main Rd','approved',1,'2025-06-12 11:30:54','2025-05-11',4.2,NULL),(9,'Spice Hub113',NULL,'LIC12346','spicehub@gmail.com','9876543210','Banglore South','Kengeri','12, Kengeri Main Rd','approved',1,'2025-06-12 11:30:54','2025-05-11',4.2,NULL),(10,'Spice Hub114',NULL,'LIC12346','spicehub@gmail.com','9876543210','Banglore South','Kengeri','12, Kengeri Main Rd','approved',1,'2025-06-12 11:30:54','2025-05-11',NULL,5),(11,'Wjdbd',NULL,'LICRV','rizwan446@gmail.com','9483384972','Banglore South','Kengeri','djcs;vckj;vbsdsjnkvdsn,vs','rejected',1,'2025-06-12 13:08:28','2025-05-11',4.2,NULL),(12,'edakj',NULL,'safhu','student@example.com','9483384972','Banglore South','Kengeri','safafa','approved',1,'2025-06-12 13:18:45','2025-05-11',4.2,NULL),(13,'edakjq',NULL,'qwqe','mallikarjun123@gmail.com','09483384972','Banglore South','Kengeri','ererwddwasa','rejected',1,'2025-06-12 13:20:18','2025-05-11',4.2,NULL),(14,'vsjbk',NULL,'siojr','faizalabedeen.ch22@rvce.edu.in','552121','Banglore South','Kengeri','wrgrggr','pending',1,'2025-06-13 04:38:15','2025-05-11',4.2,NULL),(15,'Smart Parking',NULL,'efewf','arun123@gmail.com','Fjfj','Banglore South','Kengeri','rr4wt4t21','approved',1,'2025-06-13 04:47:10','2025-05-11',4.2,NULL);
/*!40000 ALTER TABLE `restaurants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('Rizwan','user@gmail.com','947463829','pass123'),('mmr','user1@gmail.com','8075684902','pass123');
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

-- Dump completed on 2025-07-30 15:36:11
