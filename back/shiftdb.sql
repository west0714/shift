-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: shiftdb
-- ------------------------------------------------------
-- Server version	8.0.38

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
-- Table structure for table `shift_events`
--

DROP TABLE IF EXISTS `shift_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shift_events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_id` varchar(100) NOT NULL,
  `title` varchar(100) NOT NULL,
  `date` varchar(100) NOT NULL,
  `user_id` int DEFAULT NULL,
  `times` time DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `shift_events_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`smile_number`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shift_events`
--

LOCK TABLES `shift_events` WRITE;
/*!40000 ALTER TABLE `shift_events` DISABLE KEYS */;
INSERT INTO `shift_events` VALUES (37,'1739847048758','9:00-12:00','2025-03-20',2,'03:00:00'),(50,'1740466997723','16:00-21:00','2025-03-22',1,'05:00:00'),(51,'1740467005088','11:00-15:00','2025-03-23',1,'04:00:00'),(52,'1740467016241','10:00-13:00','2025-03-18',1,'03:00:00'),(53,'1740467034871','15:00-20:00','2025-03-28',1,'05:00:00'),(54,'1740467075948','10:00-15:00','2025-03-28',2,'05:00:00'),(55,'1740467314853','9:00-14:00','2025-03-25',1,'05:00:00');
/*!40000 ALTER TABLE `shift_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `smile_number` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `user_role` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `smile_number` (`smile_number`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,1,'山田','$2b$12$N0l5DQVvY5ThpmzbGurP7er.5yZshzNdfQQ3FIgr9XpPbRN7oHZze',0),(2,2,'鈴木','$2b$12$54gbIb6zUqDsGZFIb2xJkO1ZSCE70GaO59zgXmAsRnLYVF0gWv.Te',0),(5,1234,'山本','$2b$12$LjAbBLn9la98lrbyzWGqMub.Y5C1al9VSO3ceIRoaXeHgJQnYmV6i',1),(8,4,'佐藤','$2b$12$jv5pe1yhTTn4NT2rLqjske5GHtQ0qoteguUFzeYOPey9ojjVeAKyK',0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-17  9:59:26
