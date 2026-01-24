-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: quanly_booking
-- ------------------------------------------------------
-- Server version	8.0.42

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
-- Table structure for table `booking`
--

DROP TABLE IF EXISTS `booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking` (
  `MaBooking` varchar(20) NOT NULL,
  `MaKH` varchar(20) DEFAULT NULL,
  `ThoiDiemDat` datetime DEFAULT NULL,
  `ThoiDiemThanhToan` datetime DEFAULT NULL,
  `TrangThaiBooking` varchar(50) DEFAULT NULL,
  `TongTien` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`MaBooking`),
  KEY `MaKH` (`MaKH`),
  CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`MaKH`) REFERENCES `khach_hang` (`MaKH`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking`
--

LOCK TABLES `booking` WRITE;
/*!40000 ALTER TABLE `booking` DISABLE KEYS */;
/*!40000 ALTER TABLE `booking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chi_tiet_booking`
--

DROP TABLE IF EXISTS `chi_tiet_booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chi_tiet_booking` (
  `MaCTBooking` varchar(20) NOT NULL,
  `MaBooking` varchar(20) NOT NULL,
  `MaDV` varchar(20) DEFAULT NULL,
  `MaKM` varchar(20) DEFAULT NULL,
  `DonGia` decimal(12,2) DEFAULT NULL,
  `SoLuongNguoi` int DEFAULT NULL,
  `MaDatPhong` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`MaBooking`,`MaCTBooking`),
  UNIQUE KEY `uq_MaCTBooking` (`MaCTBooking`),
  KEY `MaDatPhong` (`MaDatPhong`),
  KEY `MaDV` (`MaDV`),
  KEY `MaKM` (`MaKM`),
  CONSTRAINT `chi_tiet_booking_ibfk_1` FOREIGN KEY (`MaDatPhong`) REFERENCES `dat_phong` (`MaDatPhong`),
  CONSTRAINT `chi_tiet_booking_ibfk_2` FOREIGN KEY (`MaBooking`) REFERENCES `booking` (`MaBooking`),
  CONSTRAINT `chi_tiet_booking_ibfk_3` FOREIGN KEY (`MaDV`) REFERENCES `dich_vu` (`MaDV`),
  CONSTRAINT `chi_tiet_booking_ibfk_4` FOREIGN KEY (`MaKM`) REFERENCES `khuyen_mai` (`MaKM`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chi_tiet_booking`
--

LOCK TABLES `chi_tiet_booking` WRITE;
/*!40000 ALTER TABLE `chi_tiet_booking` DISABLE KEYS */;
/*!40000 ALTER TABLE `chi_tiet_booking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chuyen_bay`
--

DROP TABLE IF EXISTS `chuyen_bay`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chuyen_bay` (
  `MaChuyenBay` varchar(20) NOT NULL,
  `HangBay` varchar(50) DEFAULT NULL,
  `GioKhoiHanh` datetime DEFAULT NULL,
  `GioHaCanh` datetime DEFAULT NULL,
  `HangGhe` varchar(20) DEFAULT NULL,
  `GiaCoBan` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`MaChuyenBay`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chuyen_bay`
--

LOCK TABLES `chuyen_bay` WRITE;
/*!40000 ALTER TABLE `chuyen_bay` DISABLE KEYS */;
/*!40000 ALTER TABLE `chuyen_bay` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `danh_gia`
--

DROP TABLE IF EXISTS `danh_gia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `danh_gia` (
  `MaDanhGia` varchar(20) NOT NULL,
  `MaCTBooking` varchar(20) DEFAULT NULL,
  `MaKH` varchar(20) DEFAULT NULL,
  `NoiDung` text,
  `SoSao` int DEFAULT NULL,
  `NgayDanhGia` date DEFAULT NULL,
  PRIMARY KEY (`MaDanhGia`),
  UNIQUE KEY `MaCTBooking` (`MaCTBooking`),
  KEY `MaKH` (`MaKH`),
  CONSTRAINT `danh_gia_ibfk_1` FOREIGN KEY (`MaCTBooking`) REFERENCES `chi_tiet_booking` (`MaCTBooking`),
  CONSTRAINT `danh_gia_ibfk_2` FOREIGN KEY (`MaKH`) REFERENCES `khach_hang` (`MaKH`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `danh_gia`
--

LOCK TABLES `danh_gia` WRITE;
/*!40000 ALTER TABLE `danh_gia` DISABLE KEYS */;
/*!40000 ALTER TABLE `danh_gia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dat_phong`
--

DROP TABLE IF EXISTS `dat_phong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dat_phong` (
  `MaDatPhong` varchar(20) NOT NULL,
  `MaPhong` varchar(20) DEFAULT NULL,
  `NgayNhan` date DEFAULT NULL,
  `NgayTra` date DEFAULT NULL,
  `TongTien` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`MaDatPhong`),
  KEY `MaPhong` (`MaPhong`),
  CONSTRAINT `dat_phong_ibfk_1` FOREIGN KEY (`MaPhong`) REFERENCES `phong` (`MaPhong`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dat_phong`
--

LOCK TABLES `dat_phong` WRITE;
/*!40000 ALTER TABLE `dat_phong` DISABLE KEYS */;
/*!40000 ALTER TABLE `dat_phong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dich_vu`
--

DROP TABLE IF EXISTS `dich_vu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dich_vu` (
  `MaDV` varchar(20) NOT NULL,
  `LoaiDichVu` varchar(50) DEFAULT NULL,
  `DonViTinh` varchar(20) DEFAULT NULL,
  `Gia` decimal(12,2) DEFAULT NULL,
  `MaXe` varchar(20) DEFAULT NULL,
  `MaChuyenBay` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`MaDV`),
  KEY `MaXe` (`MaXe`),
  KEY `MaChuyenBay` (`MaChuyenBay`),
  CONSTRAINT `dich_vu_ibfk_1` FOREIGN KEY (`MaXe`) REFERENCES `xe_dua_don` (`MaXe`),
  CONSTRAINT `dich_vu_ibfk_2` FOREIGN KEY (`MaChuyenBay`) REFERENCES `chuyen_bay` (`MaChuyenBay`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dich_vu`
--

LOCK TABLES `dich_vu` WRITE;
/*!40000 ALTER TABLE `dich_vu` DISABLE KEYS */;
/*!40000 ALTER TABLE `dich_vu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dv_du_lich`
--

DROP TABLE IF EXISTS `dv_du_lich`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dv_du_lich` (
  `MaDV_DL` varchar(20) NOT NULL,
  `DiemDon` varchar(100) DEFAULT NULL,
  `DiaDiemThamQuan` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`MaDV_DL`),
  UNIQUE KEY `MaDV_DL` (`MaDV_DL`),
  CONSTRAINT `dv_du_lich_ibfk_1` FOREIGN KEY (`MaDV_DL`) REFERENCES `dich_vu` (`MaDV`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dv_du_lich`
--

LOCK TABLES `dv_du_lich` WRITE;
/*!40000 ALTER TABLE `dv_du_lich` DISABLE KEYS */;
/*!40000 ALTER TABLE `dv_du_lich` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dv_thue_xe`
--

DROP TABLE IF EXISTS `dv_thue_xe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dv_thue_xe` (
  `MaDV_TX` varchar(20) NOT NULL,
  `KieuThue` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`MaDV_TX`),
  UNIQUE KEY `MaDV_TX` (`MaDV_TX`),
  CONSTRAINT `dv_thue_xe_ibfk_1` FOREIGN KEY (`MaDV_TX`) REFERENCES `dich_vu` (`MaDV`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dv_thue_xe`
--

LOCK TABLES `dv_thue_xe` WRITE;
/*!40000 ALTER TABLE `dv_thue_xe` DISABLE KEYS */;
/*!40000 ALTER TABLE `dv_thue_xe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dv_trung_chuyen`
--

DROP TABLE IF EXISTS `dv_trung_chuyen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dv_trung_chuyen` (
  `MaDV_TC` varchar(20) NOT NULL,
  `DiemDi` varchar(100) DEFAULT NULL,
  `DiemDen` varchar(100) DEFAULT NULL,
  `LoaiVe` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`MaDV_TC`),
  UNIQUE KEY `MaDV_TC` (`MaDV_TC`),
  CONSTRAINT `dv_trung_chuyen_ibfk_1` FOREIGN KEY (`MaDV_TC`) REFERENCES `dich_vu` (`MaDV`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dv_trung_chuyen`
--

LOCK TABLES `dv_trung_chuyen` WRITE;
/*!40000 ALTER TABLE `dv_trung_chuyen` DISABLE KEYS */;
/*!40000 ALTER TABLE `dv_trung_chuyen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `huy_booking`
--

DROP TABLE IF EXISTS `huy_booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `huy_booking` (
  `MaHuy` varchar(20) NOT NULL,
  `MaBooking` varchar(20) DEFAULT NULL,
  `NgayHuy` date DEFAULT NULL,
  `LyDo` varchar(255) DEFAULT NULL,
  `PhiHuy` decimal(12,2) DEFAULT NULL,
  `HoanTien` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`MaHuy`),
  UNIQUE KEY `MaBooking` (`MaBooking`),
  CONSTRAINT `huy_booking_ibfk_1` FOREIGN KEY (`MaBooking`) REFERENCES `booking` (`MaBooking`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `huy_booking`
--

LOCK TABLES `huy_booking` WRITE;
/*!40000 ALTER TABLE `huy_booking` DISABLE KEYS */;
/*!40000 ALTER TABLE `huy_booking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kh_email`
--

DROP TABLE IF EXISTS `kh_email`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kh_email` (
  `MaKH` varchar(20) NOT NULL,
  `Email` varchar(100) NOT NULL,
  PRIMARY KEY (`MaKH`,`Email`),
  CONSTRAINT `kh_email_ibfk_1` FOREIGN KEY (`MaKH`) REFERENCES `khach_hang` (`MaKH`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kh_email`
--

LOCK TABLES `kh_email` WRITE;
/*!40000 ALTER TABLE `kh_email` DISABLE KEYS */;
/*!40000 ALTER TABLE `kh_email` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kh_sdt`
--

DROP TABLE IF EXISTS `kh_sdt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kh_sdt` (
  `MaKH` varchar(20) NOT NULL,
  `SDT` varchar(15) NOT NULL,
  PRIMARY KEY (`MaKH`,`SDT`),
  CONSTRAINT `kh_sdt_ibfk_1` FOREIGN KEY (`MaKH`) REFERENCES `khach_hang` (`MaKH`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kh_sdt`
--

LOCK TABLES `kh_sdt` WRITE;
/*!40000 ALTER TABLE `kh_sdt` DISABLE KEYS */;
/*!40000 ALTER TABLE `kh_sdt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `khach_hang`
--

DROP TABLE IF EXISTS `khach_hang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `khach_hang` (
  `MaKH` varchar(20) NOT NULL,
  `Ho` varchar(30) NOT NULL,
  `Ten` varchar(30) NOT NULL,
  `GioiTinh` enum('Nam','Nu') DEFAULT NULL,
  `NgaySinh` date DEFAULT NULL,
  `MatKhau` varchar(100) DEFAULT NULL,
  `CCCD_HoChieu` varchar(20) DEFAULT NULL,
  `NgayTaoTK` date DEFAULT NULL,
  PRIMARY KEY (`MaKH`),
  UNIQUE KEY `CCCD_HoChieu` (`CCCD_HoChieu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `khach_hang`
--

LOCK TABLES `khach_hang` WRITE;
/*!40000 ALTER TABLE `khach_hang` DISABLE KEYS */;
/*!40000 ALTER TABLE `khach_hang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `khach_san`
--

DROP TABLE IF EXISTS `khach_san`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `khach_san` (
  `MaKS` varchar(20) NOT NULL,
  `TenKS` varchar(100) DEFAULT NULL,
  `DiaChi` varchar(255) DEFAULT NULL,
  `HangSao` int DEFAULT NULL,
  PRIMARY KEY (`MaKS`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `khach_san`
--

LOCK TABLES `khach_san` WRITE;
/*!40000 ALTER TABLE `khach_san` DISABLE KEYS */;
/*!40000 ALTER TABLE `khach_san` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `khuyen_mai`
--

DROP TABLE IF EXISTS `khuyen_mai`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `khuyen_mai` (
  `MaKM` varchar(20) NOT NULL,
  `TenKM` varchar(100) DEFAULT NULL,
  `LoaiKM` varchar(50) DEFAULT NULL,
  `DieuKien` varchar(255) DEFAULT NULL,
  `TrangThaiKM` varchar(50) DEFAULT NULL,
  `NgayApDung` date DEFAULT NULL,
  `NgayKetThuc` date DEFAULT NULL,
  PRIMARY KEY (`MaKM`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `khuyen_mai`
--

LOCK TABLES `khuyen_mai` WRITE;
/*!40000 ALTER TABLE `khuyen_mai` DISABLE KEYS */;
/*!40000 ALTER TABLE `khuyen_mai` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phong`
--

DROP TABLE IF EXISTS `phong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phong` (
  `MaPhong` varchar(20) NOT NULL,
  `MaKS` varchar(20) DEFAULT NULL,
  `LoaiPhong` varchar(50) DEFAULT NULL,
  `Gia` decimal(12,2) DEFAULT NULL,
  `SoNguoi` int DEFAULT NULL,
  PRIMARY KEY (`MaPhong`),
  KEY `MaKS` (`MaKS`),
  CONSTRAINT `phong_ibfk_1` FOREIGN KEY (`MaKS`) REFERENCES `khach_san` (`MaKS`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phong`
--

LOCK TABLES `phong` WRITE;
/*!40000 ALTER TABLE `phong` DISABLE KEYS */;
/*!40000 ALTER TABLE `phong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thanh_toan`
--

DROP TABLE IF EXISTS `thanh_toan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thanh_toan` (
  `MaTT` varchar(20) NOT NULL,
  `MaBooking` varchar(20) DEFAULT NULL,
  `ThoiDiemThanhToan` datetime DEFAULT NULL,
  `PhuongThucThanhToan` varchar(50) DEFAULT NULL,
  `TrangThaiTT` varchar(50) DEFAULT NULL,
  `SoTien` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`MaTT`),
  KEY `MaBooking` (`MaBooking`),
  CONSTRAINT `thanh_toan_ibfk_1` FOREIGN KEY (`MaBooking`) REFERENCES `booking` (`MaBooking`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thanh_toan`
--

LOCK TABLES `thanh_toan` WRITE;
/*!40000 ALTER TABLE `thanh_toan` DISABLE KEYS */;
/*!40000 ALTER TABLE `thanh_toan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `xe_dua_don`
--

DROP TABLE IF EXISTS `xe_dua_don`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `xe_dua_don` (
  `MaXe` varchar(20) NOT NULL,
  `LoaiXe` varchar(50) DEFAULT NULL,
  `SoGhe` int DEFAULT NULL,
  PRIMARY KEY (`MaXe`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `xe_dua_don`
--

LOCK TABLES `xe_dua_don` WRITE;
/*!40000 ALTER TABLE `xe_dua_don` DISABLE KEYS */;
/*!40000 ALTER TABLE `xe_dua_don` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-23 20:54:04
