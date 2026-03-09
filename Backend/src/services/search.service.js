const db = require("../configs/database");

const searchFlights = async (from, to) => {

  const query = `
    SELECT
      cb.MaChuyenBay,
      sb1.Code AS from_airport,
      sb2.Code AS to_airport,
      cb.HangBay,
      cb.GiaCoBan
    FROM CHUYEN_BAY cb
    JOIN TUYEN_DUONG td ON cb.MaTuyenDuong = td.MaTuyenDuong
    JOIN SAN_BAY sb1 ON td.MaSanBayXuatPhat = sb1.MaSanBay
    JOIN SAN_BAY sb2 ON td.MaSanBayDich = sb2.MaSanBay
    WHERE sb1.Code = :from
    AND sb2.Code = :to
  `;

  const [rows] = await db.query(query, {
    replacements: { from, to }
  });

  return rows;
};

const searchHotels = async (city) => {

  const query = `
    SELECT *
    FROM KHACH_SAN
    WHERE DiaChi LIKE :city
  `;

  const [rows] = await db.query(query, {
    replacements: { city: `%${city}%` }
  });

  return rows;
};

module.exports = {
  searchFlights,
  searchHotels
};