USE QUANLY_BOOKING;

-- =========================
-- USERS (20 users)
-- =========================
INSERT INTO USERS (Ho, Ten, Email, SDT, CCCD, Password, Role, TrangThai, TinhTrangXacMinh, NgayTaoTK) VALUES
('Nguyen', 'An', 'an1@gmail.com', '090000001', '001001001', '123456', 'USER', 'ACTIVE', 'VERIFIED', '2026-01-01 08:00:00'),
('Tran', 'Binh', 'binh2@gmail.com', '090000002', '001001002', '123456', 'USER', 'ACTIVE', 'VERIFIED', '2026-01-02 09:30:00'),
('Le', 'Chi', 'chi3@gmail.com', '090000003', '001001003', '123456', 'ADMIN', 'ACTIVE', 'VERIFIED', '2026-01-01 07:00:00'),
('Pham', 'Dung', 'dung4@gmail.com', '090000004', '001001004', '123456', 'USER', 'INACTIVE', 'PENDING', '2026-01-05 14:20:00'),
('Hoang', 'Ha', 'ha5@gmail.com', '090000005', '001001005', '123456', 'USER', 'ACTIVE', 'VERIFIED', '2026-01-10 10:15:00');

-- =========================
-- SAN BAY (10 sân bay)
-- =========================
INSERT INTO SAN_BAY (Code, Ten, CongTy) VALUES
('HAN', 'Noi Bai', 'ACV'),
('SGN', 'Tan Son Nhat', 'ACV'),
('DAD', 'Da Nang', 'ACV'),
('CXR', 'Cam Ranh', 'ACV'),
('PQC', 'Phu Quoc', 'ACV'),
('HUI', 'Phu Bai', 'ACV'),
('VCA', 'Can Tho', 'ACV'),
('VDH', 'Dong Hoi', 'ACV'),
('VCL', 'Chu Lai', 'ACV'),
('UIH', 'Phu Cat', 'ACV');

-- =========================
-- TUYEN DUONG
-- =========================
INSERT INTO TUYEN_DUONG (MaSanBayXuatPhat, MaSanBayDich)
SELECT a.MaSanBay, b.MaSanBay
FROM SAN_BAY a, SAN_BAY b
WHERE a.MaSanBay <> b.MaSanBay
LIMIT 30;

-- =========================
-- CHUYEN BAY (1000 chuyến)
-- =========================
DELIMITER $$

CREATE PROCEDURE gen_chuyen_bay()
BEGIN
    DECLARE i INT DEFAULT 1;
    WHILE i <= 1000 DO
        INSERT INTO CHUYEN_BAY (
            MaTuyenDuong, HangBay, HangGhe, GiaCoBan,
            GioKhoiHanh, GioHaCanh
        )
        VALUES (
            FLOOR(1 + RAND() * 30),
            ELT(FLOOR(1 + RAND()*4), 'Vietnam Airlines', 'Vietjet', 'Bamboo', 'Vietravel'),
            ELT(FLOOR(1 + RAND()*3), 'Economy', 'Premium', 'Business'),
            FLOOR(500000 + RAND()*3000000),
            DATE_ADD('2026-01-01 06:00:00', INTERVAL FLOOR(RAND()*720) HOUR),
            DATE_ADD('2026-01-01 08:00:00', INTERVAL FLOOR(RAND()*720) HOUR)
        );
        SET i = i + 1;
    END WHILE;
END$$
DELIMITER ;

CALL gen_chuyen_bay();
DROP PROCEDURE gen_chuyen_bay;

-- =========================
-- GHẾ (mỗi chuyến 10 ghế mẫu)
-- =========================
INSERT INTO GHE (MaChuyenBay, SoGhe, TrangThaiGhe)
SELECT MaChuyenBay, CONCAT('A', n), 'TRONG'
FROM CHUYEN_BAY
JOIN (
    SELECT 1 n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5
    UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
) x;

-- =========================
-- KHÁCH SẠN (50 KS)
-- =========================
INSERT INTO KHACH_SAN (TenKS, DiaChi, HangSao) VALUES
('KS Sunrise', 'Ha Noi', 4),
('KS Ocean', 'Da Nang', 5),
('KS Palm', 'Phu Quoc', 5),
('KS Lotus', 'HCM', 4),
('KS Sky', 'Nha Trang', 4);

-- nhân bản cho đủ 50
INSERT INTO KHACH_SAN (TenKS, DiaChi, HangSao)
SELECT CONCAT(TenKS, ' ', n), DiaChi, HangSao
FROM KHACH_SAN
JOIN (SELECT 1 n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t;

-- =========================
-- LOẠI PHÒNG (200 phòng)
-- =========================
DELIMITER $$

CREATE PROCEDURE gen_phong()
BEGIN
    DECLARE i INT DEFAULT 1;
    WHILE i <= 200 DO
        INSERT INTO LOAI_PHONG (MaKS, TenPhong, GiaPhong, SoNguoiOToiDa)
        VALUES (
            FLOOR(1 + RAND()*50),
            ELT(FLOOR(1 + RAND()*3), 'Standard', 'Deluxe', 'Suite'),
            FLOOR(500000 + RAND()*2000000),
            FLOOR(1 + RAND()*4)
        );
        SET i = i + 1;
    END WHILE;
END$$
DELIMITER ;

CALL gen_phong();
DROP PROCEDURE gen_phong;

-- =========================
-- TÌNH TRẠNG PHÒNG TRỐNG
-- =========================
INSERT INTO TINH_TRANG_PHONG_TRONG (MaLoaiPhong, NgayDatPhong, SoLuongPhongCoSan, TongTien)
SELECT MaLoaiPhong,
       DATE_ADD('2026-02-01', INTERVAL FLOOR(RAND()*30) DAY),
       FLOOR(1 + RAND()*10),
       GiaPhong * 2
FROM LOAI_PHONG;

-- =========================
-- DỊCH VỤ
-- =========================
INSERT INTO DICH_VU (LoaiDichVu, MoTa, Gia, DonViTinh) VALUES
('TRUNG_CHUYEN', 'Xe bus sân bay', 100000, 'lượt'),
('DU_LICH', 'Tour city', 1500000, 'tour'),
('THUE_XE', 'Thuê xe tự lái', 800000, 'ngày');

INSERT INTO DV_TRUNG_CHUYEN VALUES (1, 'Sân bay', 'Khách sạn', '1 chiều');
INSERT INTO DV_DU_LICH VALUES (2, 'Khách sạn', 'Bà Nà Hills');
INSERT INTO DV_THUE_XE VALUES (3, 'Theo ngày');

-- =========================
-- BOOKING + CHI TIẾT (mẫu)
-- =========================
INSERT INTO BOOKING (UserID, ThoiDiemDat, ThoiDiemThanhToan, TongTien, TrangThaiBooking)
VALUES (1, NOW(), NOW(), 5000000, 'DA_THANH_TOAN');

INSERT INTO CHI_TIET_BOOKING
(MaCTBooking, MaBooking, SoLuongNguoi, DonGia, LoaiDoiTuong, MaKM)
VALUES (1, 1, 2, 2500000, 'FLIGHT', NULL);
