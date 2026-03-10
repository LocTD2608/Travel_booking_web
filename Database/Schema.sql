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
  `MaBooking` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `ThoiDiemDat` datetime DEFAULT NULL,
  `ThoiDiemThanhToan` datetime DEFAULT NULL,
  `TongTien` decimal(15,2) DEFAULT NULL,
  `TrangThaiBooking` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`MaBooking`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`)
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
  `MaCTBooking` int NOT NULL,
  `MaBooking` int NOT NULL,
  `SoLuongNguoi` int DEFAULT NULL,
  `DonGia` decimal(15,2) DEFAULT NULL,
  `LoaiDoiTuong` varchar(30) DEFAULT NULL,
  `MaKM` int DEFAULT NULL,
  PRIMARY KEY (`MaBooking`,`MaCTBooking`),
  UNIQUE KEY `uq_MaCTBooking` (`MaCTBooking`),
  KEY `MaKM` (`MaKM`),
  CONSTRAINT `chi_tiet_booking_ibfk_1` FOREIGN KEY (`MaBooking`) REFERENCES `booking` (`MaBooking`),
  CONSTRAINT `chi_tiet_booking_ibfk_2` FOREIGN KEY (`MaKM`) REFERENCES `khuyen_mai` (`MaKM`)
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
  `MaChuyenBay` int NOT NULL AUTO_INCREMENT,
  `MaTuyenDuong` int DEFAULT NULL,
  `HangBay` varchar(50) DEFAULT NULL,
  `HangGhe` varchar(30) DEFAULT NULL,
  `GiaCoBan` decimal(15,2) DEFAULT NULL,
  `GioKhoiHanh` datetime DEFAULT NULL,
  `GioHaCanh` datetime DEFAULT NULL,
  PRIMARY KEY (`MaChuyenBay`),
  KEY `MaTuyenDuong` (`MaTuyenDuong`),
  CONSTRAINT `chuyen_bay_ibfk_1` FOREIGN KEY (`MaTuyenDuong`) REFERENCES `tuyen_duong` (`MaTuyenDuong`)
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
-- Table structure for table `ctbooking_dv`
--

DROP TABLE IF EXISTS `ctbooking_dv`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ctbooking_dv` (
  `MaCTBooking` int NOT NULL,
  `MaDV` int DEFAULT NULL,
  `MaChuyenBay` int DEFAULT NULL,
  `MaXe` int DEFAULT NULL,
  PRIMARY KEY (`MaCTBooking`),
  KEY `MaDV` (`MaDV`),
  KEY `MaChuyenBay` (`MaChuyenBay`),
  KEY `MaXe` (`MaXe`),
  CONSTRAINT `ctbooking_dv_ibfk_1` FOREIGN KEY (`MaCTBooking`) REFERENCES `chi_tiet_booking` (`MaCTBooking`),
  CONSTRAINT `ctbooking_dv_ibfk_2` FOREIGN KEY (`MaDV`) REFERENCES `dich_vu` (`MaDV`),
  CONSTRAINT `ctbooking_dv_ibfk_3` FOREIGN KEY (`MaChuyenBay`) REFERENCES `chuyen_bay` (`MaChuyenBay`),
  CONSTRAINT `ctbooking_dv_ibfk_4` FOREIGN KEY (`MaXe`) REFERENCES `xe_dua_don` (`MaXe`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ctbooking_dv`
--

LOCK TABLES `ctbooking_dv` WRITE;
/*!40000 ALTER TABLE `ctbooking_dv` DISABLE KEYS */;
/*!40000 ALTER TABLE `ctbooking_dv` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ctbooking_hotel`
--

DROP TABLE IF EXISTS `ctbooking_hotel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ctbooking_hotel` (
  `MaCTBooking` int NOT NULL,
  `MaPhongKhaDung` int DEFAULT NULL,
  PRIMARY KEY (`MaCTBooking`),
  KEY `MaPhongKhaDung` (`MaPhongKhaDung`),
  CONSTRAINT `ctbooking_hotel_ibfk_1` FOREIGN KEY (`MaCTBooking`) REFERENCES `chi_tiet_booking` (`MaCTBooking`),
  CONSTRAINT `ctbooking_hotel_ibfk_2` FOREIGN KEY (`MaPhongKhaDung`) REFERENCES `tinh_trang_phong_trong` (`MaPhongKhaDung`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ctbooking_hotel`
--

LOCK TABLES `ctbooking_hotel` WRITE;
/*!40000 ALTER TABLE `ctbooking_hotel` DISABLE KEYS */;
/*!40000 ALTER TABLE `ctbooking_hotel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `danh_gia`
--

DROP TABLE IF EXISTS `danh_gia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `danh_gia` (
  `MaDanhGia` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `MaCTBooking` int DEFAULT NULL,
  `LoaiDoiTuong` varchar(30) DEFAULT NULL,
  `SoSao` int DEFAULT NULL,
  `NoiDung` text,
  `NgayDanhGia` datetime DEFAULT NULL,
  PRIMARY KEY (`MaDanhGia`),
  KEY `MaCTBooking` (`MaCTBooking`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `danh_gia_ibfk_1` FOREIGN KEY (`MaCTBooking`) REFERENCES `chi_tiet_booking` (`MaCTBooking`),
  CONSTRAINT `danh_gia_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`),
  CONSTRAINT `danh_gia_chk_1` CHECK ((`SoSao` between 1 and 5))
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
-- Table structure for table `dich_vu`
--

DROP TABLE IF EXISTS `dich_vu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dich_vu` (
  `MaDV` int NOT NULL AUTO_INCREMENT,
  `LoaiDichVu` varchar(50) DEFAULT NULL,
  `MoTa` text,
  `Gia` decimal(15,2) DEFAULT NULL,
  `DonViTinh` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`MaDV`)
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
  `MaDV_DL` int NOT NULL,
  `DiemDon` varchar(100) DEFAULT NULL,
  `DiaDiemThamQuan` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`MaDV_DL`),
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
  `MaDV_TX` int NOT NULL,
  `KieuThue` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`MaDV_TX`),
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
  `MaDV_TC` int NOT NULL,
  `DiemDi` varchar(100) DEFAULT NULL,
  `DiemDen` varchar(100) DEFAULT NULL,
  `LoaiVe` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`MaDV_TC`),
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
-- Table structure for table `ghe`
--

DROP TABLE IF EXISTS `ghe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ghe` (
  `MaGhe` int NOT NULL AUTO_INCREMENT,
  `MaChuyenBay` int DEFAULT NULL,
  `SoGhe` varchar(10) DEFAULT NULL,
  `TrangThaiGhe` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`MaGhe`),
  KEY `MaChuyenBay` (`MaChuyenBay`),
  CONSTRAINT `ghe_ibfk_1` FOREIGN KEY (`MaChuyenBay`) REFERENCES `chuyen_bay` (`MaChuyenBay`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ghe`
--

LOCK TABLES `ghe` WRITE;
/*!40000 ALTER TABLE `ghe` DISABLE KEYS */;
/*!40000 ALTER TABLE `ghe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `huy_booking`
--

DROP TABLE IF EXISTS `huy_booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `huy_booking` (
  `MaHuy` int NOT NULL AUTO_INCREMENT,
  `MaBooking` int DEFAULT NULL,
  `LyDo` text,
  `NgayHuy` datetime DEFAULT NULL,
  `HoanTien` decimal(15,2) DEFAULT NULL,
  `PhiHuy` decimal(15,2) DEFAULT NULL,
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
-- Table structure for table `khach_san`
--

DROP TABLE IF EXISTS `khach_san`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `khach_san` (
  `MaKS` int NOT NULL AUTO_INCREMENT,
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
  `MaKM` int NOT NULL AUTO_INCREMENT,
  `TenKM` varchar(100) DEFAULT NULL,
  `LoaiKM` varchar(50) DEFAULT NULL,
  `NgayApDung` date DEFAULT NULL,
  `NgayKetThuc` date DEFAULT NULL,
  `DieuKien` text,
  `TrangThaiKM` varchar(30) DEFAULT NULL,
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
-- Table structure for table `loai_phong`
--

DROP TABLE IF EXISTS `loai_phong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loai_phong` (
  `MaLoaiPhong` int NOT NULL AUTO_INCREMENT,
  `MaKS` int DEFAULT NULL,
  `TenPhong` varchar(100) DEFAULT NULL,
  `GiaPhong` decimal(15,2) DEFAULT NULL,
  `SoNguoiOToiDa` int DEFAULT NULL,
  PRIMARY KEY (`MaLoaiPhong`),
  KEY `MaKS` (`MaKS`),
  CONSTRAINT `loai_phong_ibfk_1` FOREIGN KEY (`MaKS`) REFERENCES `khach_san` (`MaKS`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loai_phong`
--

LOCK TABLES `loai_phong` WRITE;
/*!40000 ALTER TABLE `loai_phong` DISABLE KEYS */;
/*!40000 ALTER TABLE `loai_phong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `san_bay`
--

DROP TABLE IF EXISTS `san_bay`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `san_bay` (
  `MaSanBay` int NOT NULL AUTO_INCREMENT,
  `Code` varchar(10) DEFAULT NULL,
  `Ten` varchar(100) DEFAULT NULL,
  `CongTy` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`MaSanBay`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `san_bay`
--

LOCK TABLES `san_bay` WRITE;
/*!40000 ALTER TABLE `san_bay` DISABLE KEYS */;
/*!40000 ALTER TABLE `san_bay` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thanh_toan`
--

DROP TABLE IF EXISTS `thanh_toan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thanh_toan` (
  `MaTT` int NOT NULL AUTO_INCREMENT,
  `MaBooking` int DEFAULT NULL,
  `PhuongThucThanhToan` varchar(50) DEFAULT NULL,
  `SoTien` decimal(15,2) DEFAULT NULL,
  `TrangThaiTT` varchar(30) DEFAULT NULL,
  `ThoiDiemThanhToan` datetime DEFAULT NULL,
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
-- Table structure for table `tinh_trang_phong_trong`
--

DROP TABLE IF EXISTS `tinh_trang_phong_trong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tinh_trang_phong_trong` (
  `MaPhongKhaDung` int NOT NULL AUTO_INCREMENT,
  `MaLoaiPhong` int DEFAULT NULL,
  `NgayDatPhong` date DEFAULT NULL,
  `SoLuongPhongCoSan` int DEFAULT NULL,
  `TongTien` decimal(15,2) DEFAULT NULL,
  PRIMARY KEY (`MaPhongKhaDung`),
  KEY `MaLoaiPhong` (`MaLoaiPhong`),
  CONSTRAINT `tinh_trang_phong_trong_ibfk_1` FOREIGN KEY (`MaLoaiPhong`) REFERENCES `loai_phong` (`MaLoaiPhong`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tinh_trang_phong_trong`
--

LOCK TABLES `tinh_trang_phong_trong` WRITE;
/*!40000 ALTER TABLE `tinh_trang_phong_trong` DISABLE KEYS */;
/*!40000 ALTER TABLE `tinh_trang_phong_trong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tuyen_duong`
--

DROP TABLE IF EXISTS `tuyen_duong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tuyen_duong` (
  `MaTuyenDuong` int NOT NULL AUTO_INCREMENT,
  `MaSanBayXuatPhat` int DEFAULT NULL,
  `MaSanBayDich` int DEFAULT NULL,
  PRIMARY KEY (`MaTuyenDuong`),
  KEY `MaSanBayXuatPhat` (`MaSanBayXuatPhat`),
  KEY `MaSanBayDich` (`MaSanBayDich`),
  CONSTRAINT `tuyen_duong_ibfk_1` FOREIGN KEY (`MaSanBayXuatPhat`) REFERENCES `san_bay` (`MaSanBay`),
  CONSTRAINT `tuyen_duong_ibfk_2` FOREIGN KEY (`MaSanBayDich`) REFERENCES `san_bay` (`MaSanBay`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tuyen_duong`
--

LOCK TABLES `tuyen_duong` WRITE;
/*!40000 ALTER TABLE `tuyen_duong` DISABLE KEYS */;
/*!40000 ALTER TABLE `tuyen_duong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Ho` varchar(100) DEFAULT NULL,
  `Ten` varchar(100) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `SDT` varchar(15) DEFAULT NULL,
  `CCCD` varchar(20) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `Role` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_email`
--

DROP TABLE IF EXISTS `users_email`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_email` (
  `UserID` int NOT NULL,
  `Email` varchar(100) NOT NULL,
  PRIMARY KEY (`UserID`,`Email`),
  CONSTRAINT `users_email_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_email`
--

LOCK TABLES `users_email` WRITE;
/*!40000 ALTER TABLE `users_email` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_email` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_sdt`
--

DROP TABLE IF EXISTS `users_sdt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_sdt` (
  `UserID` int NOT NULL,
  `SDT` varchar(100) NOT NULL,
  PRIMARY KEY (`UserID`,`SDT`),
  CONSTRAINT `users_sdt_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_sdt`
--

LOCK TABLES `users_sdt` WRITE;
/*!40000 ALTER TABLE `users_sdt` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_sdt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `xe_dua_don`
--

DROP TABLE IF EXISTS `xe_dua_don`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `xe_dua_don` (
  `MaXe` int NOT NULL AUTO_INCREMENT,
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

-- Dump completed on 2026-01-28 23:49:00
