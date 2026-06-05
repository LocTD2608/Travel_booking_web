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
            MaTuyenDuong, HangBay, GiaCoBan,
            GioKhoiHanh, GioHaCanh
        )
        VALUES (
            FLOOR(1 + RAND() * 30),
            ELT(FLOOR(1 + RAND()*4), 'Vietnam Airlines', 'Vietjet', 'Bamboo', 'Vietravel'),
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
DELIMITER $$
CREATE PROCEDURE gen_ghe()
BEGIN
    DECLARE i INT DEFAULT 1;
    WHILE i <= 1000 DO
        -- Business
        INSERT INTO GHE (MaChuyenBay, SoGhe, HangGhe, GiaPhuPhi, TrangThaiGhe) VALUES
        (i, '1A', 'business', 1500000, 'TRONG'), (i, '1C', 'business', 1500000, 'TRONG'), (i, '1D', 'business', 1500000, 'TRONG'), (i, '1F', 'business', 1500000, 'TRONG'),
        (i, '2A', 'business', 1500000, 'TRONG'), (i, '2C', 'business', 1500000, 'TRONG'), (i, '2D', 'business', 1500000, 'TRONG'), (i, '2F', 'business', 1500000, 'TRONG');
        
        -- Premium
        INSERT INTO GHE (MaChuyenBay, SoGhe, HangGhe, GiaPhuPhi, TrangThaiGhe) VALUES
        (i, '3A', 'premium', 500000, 'TRONG'), (i, '3B', 'premium', 500000, 'TRONG'), (i, '3C', 'premium', 500000, 'TRONG'), (i, '3D', 'premium', 500000, 'TRONG'), (i, '3E', 'premium', 500000, 'TRONG'), (i, '3F', 'premium', 500000, 'TRONG'),
        (i, '4A', 'premium', 500000, 'TRONG'), (i, '4B', 'premium', 500000, 'TRONG'), (i, '4C', 'premium', 500000, 'TRONG'), (i, '4D', 'premium', 500000, 'TRONG'), (i, '4E', 'premium', 500000, 'TRONG'), (i, '4F', 'premium', 500000, 'TRONG');
        
        -- Economy
        INSERT INTO GHE (MaChuyenBay, SoGhe, HangGhe, GiaPhuPhi, TrangThaiGhe) VALUES
        (i, '5A', 'eco', 0, 'TRONG'), (i, '5B', 'eco', 0, 'TRONG'), (i, '5C', 'eco', 0, 'TRONG'), (i, '5D', 'eco', 0, 'TRONG'), (i, '5E', 'eco', 0, 'TRONG'), (i, '5F', 'eco', 0, 'TRONG'),
        (i, '6A', 'eco', 0, 'TRONG'), (i, '6B', 'eco', 0, 'TRONG'), (i, '6C', 'eco', 0, 'TRONG'), (i, '6D', 'eco', 0, 'TRONG'), (i, '6E', 'eco', 0, 'TRONG'), (i, '6F', 'eco', 0, 'TRONG');
        
        -- Randomly mark 1 seat as occupied to test UI
        UPDATE GHE SET TrangThaiGhe = 'DA_DAT' WHERE MaChuyenBay = i AND SoGhe = '4C';
        
        SET i = i + 1;
    END WHILE;
END$$
DELIMITER ;
CALL gen_ghe();
DROP PROCEDURE gen_ghe;

-- =========================
-- KHÁCH SẠN (50 KS)
-- =========================
INSERT INTO KHACH_SAN (TenKS, DiaChi, HangSao) VALUES
('InterContinental Hanoi Landmark', 'Ha Noi', 5),
('Lotte Hotel Hanoi', 'Ha Noi', 5),
('JW Marriott Hanoi', 'Ha Noi', 5),
('Melia Hanoi', 'Ha Noi', 5),
('Apricot Hotel', 'Ha Noi', 4),

('Rex Hotel Saigon', 'Ho Chi Minh', 5),
('Hotel Nikko Saigon', 'Ho Chi Minh', 5),
('The Reverie Saigon', 'Ho Chi Minh', 5),
('Liberty Central Saigon', 'Ho Chi Minh', 4),
('Silverland Yen Hotel', 'Ho Chi Minh', 4),

('Novotel Danang Premier', 'Da Nang', 5),
('Fusion Suites Danang', 'Da Nang', 4),
('Sala Danang Beach Hotel', 'Da Nang', 4),
('Mandila Beach Hotel', 'Da Nang', 4),
('Grand Mercure Danang', 'Da Nang', 5),

('Vinpearl Resort Nha Trang', 'Nha Trang', 5),
('InterContinental Nha Trang', 'Nha Trang', 5),
('Queen Ann Nha Trang', 'Nha Trang', 4),
('Liberty Central Nha Trang', 'Nha Trang', 4),
('Dendro Gold Hotel', 'Nha Trang', 4),

('Seashells Phu Quoc', 'Phu Quoc', 5),
('Movenpick Resort Waverly', 'Phu Quoc', 5),
('Salinda Resort', 'Phu Quoc', 5),
('Lahana Resort', 'Phu Quoc', 4),
('VinHolidays Fiesta', 'Phu Quoc', 4),

('Pao’s Sapa Leisure', 'Sapa', 5),
('KK Sapa Hotel', 'Sapa', 5),
('Amazing Sapa Hotel', 'Sapa', 4),
('Sapa Horizon Hotel', 'Sapa', 4),
('Bamboo Sapa Hotel', 'Sapa', 4),

('Sheraton Can Tho', 'Can Tho', 5),
('Muong Thanh Luxury Can Tho', 'Can Tho', 5),
('West Hotel Can Tho', 'Can Tho', 4),
('Nesta Hotel Can Tho', 'Can Tho', 4),
('TTC Hotel Can Tho', 'Can Tho', 4),

('Melia Vinpearl Hue', 'Hue', 5),
('Indochine Palace Hue', 'Hue', 5),
('Century Riverside Hue', 'Hue', 4),
('Moonlight Hotel Hue', 'Hue', 4),
('White Lotus Hue', 'Hue', 4),

('FLC Halong Bay', 'Ha Long', 5),
('Wyndham Legend Halong', 'Ha Long', 5),
('Royal Halong Hotel', 'Ha Long', 4),
('DeLaSea Ha Long', 'Ha Long', 4),
('Muong Thanh Ha Long', 'Ha Long', 4),

('Terracotta Hotel Da Lat', 'Da Lat', 4),
('Colline Da Lat', 'Da Lat', 4),
('Golf Valley Hotel', 'Da Lat', 4),
('Dalat Wonder Resort', 'Da Lat', 5),
('Ana Mandara Villas Dalat', 'Da Lat', 5);

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
('THUE_XE', 'Thuê xe tự lái', 800000, 'ngày'),
('DU_LICH', 'Tour Ha Long 2N1D', 2500000, 'tour'),
('DU_LICH', 'Tour Da Nang - Hoi An', 3200000, 'tour'),
('DU_LICH', 'Tour Phu Quoc 3N2D', 5500000, 'tour'),
('DU_LICH', 'Tour Da Lat San May', 2900000, 'tour'),
('DU_LICH', 'Tour Sapa Trekking', 3500000, 'tour'),
('DU_LICH', 'Tour Hue Ancient Capital', 2100000, 'tour'),
('DU_LICH', 'Tour Nha Trang Island', 4000000, 'tour'),
('DU_LICH', 'Tour Mekong Delta', 1800000, 'tour'),
('DU_LICH', 'Tour Ba Na Hills', 1700000, 'tour'),
('DU_LICH', 'Tour Mui Ne Resort', 3600000, 'tour'),
('DU_LICH', 'Tour Con Dao Relax', 6200000, 'tour'),
('DU_LICH', 'Tour Ha Giang Loop', 4800000, 'tour'),
('DU_LICH', 'Tour Quy Nhon Beach', 3900000, 'tour'),
('DU_LICH', 'Tour Ninh Binh Discovery', 2300000, 'tour'),
('DU_LICH', 'Tour Cat Ba Island', 2700000, 'tour');

INSERT INTO DV_TRUNG_CHUYEN VALUES (1, 'Sân bay', 'Khách sạn', '1 chiều');
INSERT INTO DV_DU_LICH VALUES (2, 'Khách sạn', 'Bà Nà Hills');
INSERT INTO DV_THUE_XE VALUES (3, 'Theo ngày');
INSERT INTO DV_DU_LICH (
    MaDV_DL,
    DiemDon,
    DiaDiemThamQuan
) VALUES
(4, 'Ha Noi', 'Ha Long Bay'),
(5, 'Da Nang', 'Hoi An Ancient Town'),
(6, 'Ho Chi Minh', 'Phu Quoc Island'),
(7, 'Ho Chi Minh', 'Da Lat'),
(8, 'Ha Noi', 'Fansipan Sapa'),
(9, 'Hue', 'Dai Noi Hue'),
(10, 'Nha Trang', 'Hon Mun Island'),
(11, 'Can Tho', 'Mekong Delta'),
(12, 'Da Nang', 'Ba Na Hills'),
(13, 'Ho Chi Minh', 'Mui Ne Beach'),
(14, 'Ho Chi Minh', 'Con Dao'),
(15, 'Ha Noi', 'Ha Giang'),
(16, 'Quy Nhon', 'Ky Co Beach'),
(17, 'Ha Noi', 'Trang An Ninh Binh'),
(18, 'Hai Phong', 'Cat Ba Island');

-- =========================
-- BOOKING + CHI TIẾT (mẫu)
-- =========================
INSERT INTO BOOKING (UserID, ThoiDiemDat, ThoiDiemThanhToan, TongTien, TrangThaiBooking)
VALUES (1, NOW(), NOW(), 5000000, 'DA_THANH_TOAN');

INSERT INTO CHI_TIET_BOOKING
(MaCTBooking, MaBooking, SoLuongNguoi, DonGia, LoaiDoiTuong, MaKM)
VALUES (1, 1, 2, 2500000, 'FLIGHT', NULL);

-- =========================
-- KHUYẾN MÃI
-- =========================
INSERT INTO KHUYEN_MAI (TenKM, LoaiKM, NgayApDung, NgayKetThuc, DieuKien, TrangThaiKM) VALUES 
('Up to 20% Off\nDining Vouchers', 'PROMO', '2026-06-01', '2026-12-31', 
 '{"badge": "LIMITED TIME", "badgeColor": "yellow", "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCUh0E7h4kKz315MnHIzv_UTPH9iYSAgKp5u59CVwebESS8qSBsR-xoVQ2FnLHoG5zZJl_Fogvhc8S0JhBWbxmRMBY0e2ehHNkC1z1VcRZGaNtQxLDWBvFPsZxf9nlwpRZ4fC5oBPlOw-cT8QWF6VVE7zimKRvocqbiKSv5f4cA9S9W8vrQIgFuW7Yk5ktPwbIWZaPyOG527-J3nX-IawG9l7rUMl5xXTHdd5FRn9LzMkLbuXDkUyImJ5mM6g3gCN9PAqVNmcLU47c", "targetUrl": "/experience"}', 
 'ACTIVE'),

('International Flights\nStarting from $199', 'PROMO', '2026-06-01', '2026-12-31', 
 '{"badge": "FLIGHT DEAL", "badgeColor": "blue", "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuAMv7gS5O3bc8_67hLa_ydpldx0r7L-BjMVVuBXmPyPgxNAKGl4T3lEVXH7yom2ylDE7ZXpw0ydLkviVAoRUd3fiznhTZOp1e_anYolCVExsN7jbxyhTLXMBiuIIsrjUTR1rSLBebaqGKiWZ57YKgfPR-owgYKTWy1qgRIoFXWfU7YIMmjoBYyH7qnu0j629oPlTus3NFbKsejq68LMsWL2MnMHMmI2TFvTAgPLJkHPb0SJvQoQZNRzy3xC3MbkUjXzR81uOH4M0-g", "targetUrl": "/flights"}', 
 'ACTIVE'),

('Weekend Getaway\nPackages', 'PROMO', '2026-06-01', '2026-12-31', 
 '{"badge": "STAYCATION", "badgeColor": "purple", "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuAOUxGIqRVbUdCmNozeycTjPhDt_WulULzmrpwAYNT23GLnTpMZIjQx3_lMKlzxDiPhxyoPNv94FFLJ1h5LsFyBY9HCq9S1hDbYRY4rn8cJQUil7v5O8Ii3aJSaS5-tLEvLTVfgYcbBKlyuGWlxWvtpPur_Vl4dqHseFqq9iJIkY4t1srjZcnCy0hJyD_el7_KKlhpACaERsV-cfTdy2YQ-KFLzUobD6DqOpaGzJIm44DDbz1bmqcOOD4IUT7525OZGvfKAZTKNxE0", "targetUrl": "/hotels"}', 
 'ACTIVE');

INSERT INTO KHUYEN_MAI (TenKM, LoaiKM, NgayApDung, NgayKetThuc, DieuKien, TrangThaiKM) VALUES 
('FLYHIGH', 'COUPON', '2026-06-01', '2026-12-31', 
 '{"title": "International Flights", "discount": "Save $50", "terms": "Min. spend $500 • Valid until Dec 31", "icon": "flight_takeoff", "color": "blue"}', 
 'ACTIVE'),

('STAYLUXE', 'COUPON', '2026-06-01', '2026-12-31', 
 '{"title": "First Hotel Booking", "discount": "15% OFF", "terms": "Max discount $30 • New users only", "icon": "hotel", "color": "orange"}', 
 'ACTIVE'),

('FUNTIME', 'COUPON', '2026-06-01', '2026-12-31', 
 '{"title": "Xperience Activity", "discount": "10% Back", "terms": "Cashback in points • All activities", "icon": "local_activity", "color": "purple"}', 
 'ACTIVE');
