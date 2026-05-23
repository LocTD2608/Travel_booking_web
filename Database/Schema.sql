DROP DATABASE IF EXISTS QUANLY_BOOKING;

-- =========================
-- TẠO DATABASE
-- =========================
CREATE DATABASE IF NOT EXISTS QUANLY_BOOKING;
USE QUANLY_BOOKING;
-- =========================
-- Users
-- =========================
CREATE TABLE USERS (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Ho VARCHAR(100),
    Ten VARCHAR(100),
    Email VARCHAR(100) UNIQUE,
    SDT VARCHAR(15)UNIQUE,
    CCCD VARCHAR(20) UNIQUE,
    Password VARCHAR(255),
    Role VARCHAR(30),
    TrangThai VARCHAR(50),
    TinhTrangXacMinh VARCHAR(50),
    NgayTaoTK DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE USERS_EMAIL (
    UserID INT,
    Email VARCHAR(100),
    PRIMARY KEY (UserID, Email),
    FOREIGN KEY (UserID) REFERENCES USERS(UserID)
);

CREATE TABLE USERS_SDT (
    UserID INT,
    SDT VARCHAR(100),
    PRIMARY KEY (UserID, SDT),
    FOREIGN KEY (UserID) REFERENCES USERS(UserID)
);

-- =========================
-- BOOKING
-- =========================
CREATE TABLE BOOKING (
    MaBooking INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    ThoiDiemDat DATETIME,
    ThoiDiemThanhToan DATETIME,
    TongTien DECIMAL(15,2),
    TrangThaiBooking VARCHAR(30),
    FOREIGN KEY (UserID) REFERENCES USERS(UserID)
);

-- =========================
-- THANH TOÁN
-- =========================
CREATE TABLE THANH_TOAN (
    MaTT INT PRIMARY KEY AUTO_INCREMENT,
    MaBooking INT,
    PhuongThucThanhToan VARCHAR(50),
    SoTien DECIMAL(15,2),
    TrangThaiTT VARCHAR(30),
    ThoiDiemThanhToan DATETIME,
    FOREIGN KEY (MaBooking) REFERENCES BOOKING(MaBooking)
);

-- =========================
-- HỦY BOOKING
-- =========================
CREATE TABLE HUY_BOOKING (
    MaHuy INT PRIMARY KEY AUTO_INCREMENT,
    MaBooking INT UNIQUE,
    LyDo TEXT,
    NgayHuy DATETIME,
    HoanTien DECIMAL(15,2),
    PhiHuy DECIMAL(15,2),
    FOREIGN KEY (MaBooking) REFERENCES BOOKING(MaBooking)
);

-- =========================
-- KHUYẾN MÃI
-- =========================
CREATE TABLE KHUYEN_MAI (
    MaKM INT PRIMARY KEY AUTO_INCREMENT,
    TenKM VARCHAR(100),
    LoaiKM VARCHAR(50),
    NgayApDung DATE,
    NgayKetThuc DATE,
    DieuKien TEXT,
    TrangThaiKM VARCHAR(30)
);

-- =========================
-- SÂN BAY
-- =========================
CREATE TABLE SAN_BAY (
    MaSanBay INT PRIMARY KEY AUTO_INCREMENT,
    Code VARCHAR(10),
    Ten VARCHAR(100),
    CongTy VARCHAR(100)
);

-- =========================
-- TUYẾN ĐƯỜNG
-- =========================
CREATE TABLE TUYEN_DUONG (
    MaTuyenDuong INT PRIMARY KEY AUTO_INCREMENT,
    MaSanBayXuatPhat INT,
    MaSanBayDich INT,
    FOREIGN KEY (MaSanBayXuatPhat) REFERENCES SAN_BAY(MaSanBay),
    FOREIGN KEY (MaSanBayDich) REFERENCES SAN_BAY(MaSanBay)
);

-- =========================
-- CHUYẾN BAY
-- =========================
CREATE TABLE CHUYEN_BAY (
    MaChuyenBay INT PRIMARY KEY AUTO_INCREMENT,
    MaTuyenDuong INT,
    HangBay VARCHAR(50),
    HangGhe VARCHAR(30),
    GiaCoBan DECIMAL(15,2),
    GioKhoiHanh DATETIME,
    GioHaCanh DATETIME,
    FOREIGN KEY (MaTuyenDuong) REFERENCES TUYEN_DUONG(MaTuyenDuong)
);

-- =========================
-- GHẾ
-- =========================
CREATE TABLE GHE (
    MaGhe INT PRIMARY KEY AUTO_INCREMENT,
    MaChuyenBay INT,
    SoGhe VARCHAR(10),
    TrangThaiGhe VARCHAR(30),
    FOREIGN KEY (MaChuyenBay) REFERENCES CHUYEN_BAY(MaChuyenBay)
);

-- =========================
-- XE ĐƯA ĐÓN
-- =========================
CREATE TABLE XE_DUA_DON (
    MaXe INT PRIMARY KEY AUTO_INCREMENT,
    LoaiXe VARCHAR(50),
    SoGhe INT
);

-- =========================
-- KHÁCH SẠN
-- =========================
CREATE TABLE KHACH_SAN (
    MaKS INT PRIMARY KEY AUTO_INCREMENT,
    TenKS VARCHAR(100),
    DiaChi VARCHAR(255),
    HangSao INT
);

-- =========================
-- LOẠI PHÒNG
-- =========================
CREATE TABLE LOAI_PHONG (
    MaLoaiPhong INT PRIMARY KEY AUTO_INCREMENT,
    MaKS INT,
    TenPhong VARCHAR(100),
    GiaPhong DECIMAL(15,2),
    SoNguoiOToiDa INT,
    FOREIGN KEY (MaKS) REFERENCES KHACH_SAN(MaKS)
);


-- =========================
-- TÌNH TRẠNG PHÒNG TRỐNG
-- =========================
CREATE TABLE TINH_TRANG_PHONG_TRONG (
    MaPhongKhaDung INT PRIMARY KEY AUTO_INCREMENT,
    MaLoaiPhong INT,
    NgayDatPhong DATE,
    SoLuongPhongCoSan INT,
    TongTien DECIMAL(15,2),
    FOREIGN KEY (MaLoaiPhong) REFERENCES LOAI_PHONG(MaLoaiPhong)
);

-- =========================
-- DỊCH VỤ (CHA)
-- =========================
CREATE TABLE DICH_VU (
    MaDV INT PRIMARY KEY AUTO_INCREMENT,
    LoaiDichVu VARCHAR(50),
    MoTa TEXT,
    Gia DECIMAL(15,2),
    DonViTinh VARCHAR(20)
);

-- =========================
-- DV TRUNG CHUYỂN
-- =========================
CREATE TABLE DV_TRUNG_CHUYEN (
    MaDV_TC INT PRIMARY KEY,
    DiemDi VARCHAR(100),
    DiemDen VARCHAR(100),
    LoaiVe VARCHAR(30),
    FOREIGN KEY (MaDV_TC) REFERENCES DICH_VU(MaDV)
);


-- =========================
-- DV DU LỊCH
-- =========================
CREATE TABLE DV_DU_LICH (
    MaDV_DL INT PRIMARY KEY,
    DiemDon VARCHAR(100),
    DiaDiemThamQuan VARCHAR(100),
    FOREIGN KEY (MaDV_DL) REFERENCES DICH_VU(MaDV)
);

-- =========================
-- DV THUÊ XE
-- =========================
CREATE TABLE DV_THUE_XE (
    MaDV_TX INT PRIMARY KEY,
    KieuThue VARCHAR(50),
    FOREIGN KEY (MaDV_TX) REFERENCES DICH_VU(MaDV)
);

-- =========================
-- CHI TIẾT BOOKING (TRUNG TÂM)
-- =========================
CREATE TABLE CHI_TIET_BOOKING (
    MaCTBooking INT ,
    MaBooking INT,
    SoLuongNguoi INT,
    DonGia DECIMAL(15,2),
    LoaiDoiTuong VARCHAR(30),
    MaKM INT,
    TenDichVu VARCHAR(255),
    HinhAnh VARCHAR(255),
    ThongTinThem TEXT,
    PRIMARY KEY (MaBooking, MaCTBooking),
    FOREIGN KEY (MaBooking) REFERENCES BOOKING(MaBooking),
    FOREIGN KEY (MaKM) REFERENCES KHUYEN_MAI(MaKM)
);

ALTER TABLE CHI_TIET_BOOKING
ADD CONSTRAINT uq_MaCTBooking UNIQUE (MaCTBooking);

-- =========================
-- CHI TIẾT BOOKING HOTEL
-- =========================
CREATE TABLE CTBOOKING_HOTEL (
    MaCTBooking INT PRIMARY KEY,
    MaPhongKhaDung INT,
    FOREIGN KEY (MaCTBooking) REFERENCES CHI_TIET_BOOKING(MaCTBooking),
    FOREIGN KEY (MaPhongKhaDung) REFERENCES TINH_TRANG_PHONG_TRONG(MaPhongKhaDung)
);

-- =========================
-- CHI TIẾT BOOKING DỊCH VỤ
-- =========================
CREATE TABLE CTBOOKING_DV (
    MaCTBooking INT PRIMARY KEY,
    MaDV INT,
    MaChuyenBay INT,
    MaXe INT,
    FOREIGN KEY (MaCTBooking) REFERENCES CHI_TIET_BOOKING(MaCTBooking),
    FOREIGN KEY (MaDV) REFERENCES DICH_VU(MaDV),
    FOREIGN KEY (MaChuyenBay) REFERENCES CHUYEN_BAY(MaChuyenBay),
    FOREIGN KEY (MaXe) REFERENCES XE_DUA_DON(MaXe)
);

-- =========================
-- ĐÁNH GIÁ
-- =========================
CREATE TABLE DANH_GIA (
    MaDanhGia INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    MaCTBooking INT,
    LoaiDoiTuong VARCHAR(30),
    SoSao INT CHECK (SoSao BETWEEN 1 AND 5),
    NoiDung TEXT,
    NgayDanhGia DATETIME,
    FOREIGN KEY (MaCTBooking) REFERENCES CHI_TIET_BOOKING(MaCTBooking),
    FOREIGN KEY (UserID) REFERENCES USERS(UserID)
);

