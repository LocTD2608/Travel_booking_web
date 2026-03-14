const db = require("../configs/database");

// Tìm kiếm chuyến bay
const searchFlights = async (from, to, airline, seatClass, minPrice, maxPrice, sort) => {

  let query = `
    SELECT
      cb.MaChuyenBay,
      sb1.Code AS from_airport,
      sb2.Code AS to_airport,
      cb.HangBay,
      cb.HangGhe,
      cb.GiaCoBan,
      cb.GioKhoiHanh,
      cb.GioHaCanh
    FROM CHUYEN_BAY cb
    JOIN TUYEN_DUONG td ON cb.MaTuyenDuong = td.MaTuyenDuong
    JOIN SAN_BAY sb1 ON td.MaSanBayXuatPhat = sb1.MaSanBay
    JOIN SAN_BAY sb2 ON td.MaSanBayDich = sb2.MaSanBay
    WHERE sb1.Code = :from
    AND sb2.Code = :to
  `;

  const replacements = { from, to };

  // Lọc theo hãng bay
  if (airline) {
    query += ` AND cb.HangBay = :airline`;
    replacements.airline = airline;
  }

  // Lọc theo hạng ghế
  if (seatClass) {
    query += ` AND cb.HangGhe = :seatClass`;
    replacements.seatClass = seatClass;
  }

  // Lọc theo giá tối thiểu
  if (minPrice) {
    query += ` AND cb.GiaCoBan >= :minPrice`;
    replacements.minPrice = minPrice;
  }

  // Lọc theo giá tối đa
  if (maxPrice) {
    query += ` AND cb.GiaCoBan <= :maxPrice`;
    replacements.maxPrice = maxPrice;
  }

  // Sắp xếp kết quả theo giá
  if (sort === "asc") {
    query += ` ORDER BY cb.GiaCoBan ASC`;
  }

  if (sort === "desc") {
    query += ` ORDER BY cb.GiaCoBan DESC`;
  }

  const [rows] = await db.query(query, {
    replacements
  });

  return rows;
};


// Tìm kiếm khách sạn

const searchHotels = async (city, star, minPrice, maxPrice, sort) => {

  let query = `
    SELECT 
      ks.MaKS,
      ks.TenKS,
      ks.DiaChi,
      ks.HangSao,
      MIN(lp.GiaPhong) AS GiaThapNhat
    FROM KHACH_SAN ks
    JOIN LOAI_PHONG lp ON ks.MaKS = lp.MaKS
    WHERE ks.DiaChi LIKE :city
  `;

  const replacements = { city: `%${city}%` };

  // Lọc theo số sao khách sạn
  if (star) {
    query += ` AND ks.HangSao >= :star`;
    replacements.star = star;
  }

  // Lọc theo giá phòng tối thiểu
  if (minPrice) {
    query += ` AND lp.GiaPhong >= :minPrice`;
    replacements.minPrice = minPrice;
  }

  // Lọc theo giá phòng tối đa
  if (maxPrice) {
    query += ` AND lp.GiaPhong <= :maxPrice`;
    replacements.maxPrice = maxPrice;
  }

  query += ` GROUP BY ks.MaKS`;

  // Sắp xếp theo giá phòng
  if (sort === "asc") {
    query += ` ORDER BY GiaThapNhat ASC`;
  }

  if (sort === "desc") {
    query += ` ORDER BY GiaThapNhat DESC`;
  }

  const [rows] = await db.query(query, {
    replacements
  });

  return rows;
};

module.exports = {
  searchFlights,
  searchHotels
};